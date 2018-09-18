import {ActionsObservable, StateObservable} from "redux-observable";
import {isActionOf} from "typesafe-actions";
import {RootAction, RootState} from "../store";
import {catchError, concatMap, delay, expand, filter, map, share, switchMap, tap} from "rxjs/operators";
import {empty, EMPTY, from, merge, Observable, of} from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import {Buffer} from "buffer";

import * as deviceActions from '../actions/device-actions';
import {startMotorHandler, writeFileProgress} from '../actions/device-actions';
import {Packet} from "../nxt-structure/packets/packet";
import {NXTFile} from "../nxt-structure/nxt-file";
import {Write} from "../nxt-structure/packets/system/write";
import {Close} from "../nxt-structure/packets/system/close";
import {OpenWrite} from "../nxt-structure/packets/system/open-write";
import {StartProgram} from "../nxt-structure/packets/direct/start-program";
import {OutputConfig, PacketError} from "../reducers/device";
import {Actions} from "react-native-router-flux";
import {DirectCommandResponse} from "../nxt-structure/packets/direct-command-response";
import {Alert} from "react-native";
import {fileList, SteeringControl} from "../utils/Files";
import {ConnectionStatus} from "../reducers/bluetooth";
import {SteeringConfig} from "../nxt-structure/motor/motor-constants";
import {MessageWrite} from "../nxt-structure/packets/direct/message-write";

/**
 * Write a packet to the device, and return an observer that will wait for the packet to be written
 * @param {Packet} packet the packet to write
 * @returns {Observable<Packet>} the observer
 */
function writePacket<T extends Packet>(packet: T): Observable<T> {
    return from(ReactNativeBluetoothSerial.write(Buffer.from(packet.writePacket(true))).then(() => packet));
}

const CONFIG_PACKET_ID = "B";
const DRIVE_PACKET_ID = "A";
const PACKET_MAILBOX = 0;
export const motorHandler = (action$: ActionsObservable<RootAction>, state$: StateObservable<RootState>) =>
    action$.pipe(
        filter(isActionOf(deviceActions.startMotorHandler.request)),
        map(() => state$.value.device.outputConfig),
        expand(prevOut => {
            let state = state$.value;
            let out = state.device.outputConfig;
            if (state.bluetooth.status == ConnectionStatus.DISCONNECTED) {
                return empty();
            }
            if (out.config == SteeringConfig.TANK && !out.tankOutputs.leftPort || !out.tankOutputs.rightPort) {
                out.targetAngle = 0;
                out.power = 0;
            }
            if (out.config == SteeringConfig.FRONT_STEERING && (!out.frontOutputs.steeringPort || !out.frontOutputs.drivePort)) {
                out.targetAngle = 0;
                out.power = 0;
            }
            if (out.targetAngle != prevOut.targetAngle || out.power != prevOut.power) {
                let outAngle = out.targetAngle * (out.invertSteering ? -1 : 1);
                let outPower = out.power * (out.invertThrottle ? -1 : 1);
                return writePacket(MessageWrite.createPacket(PACKET_MAILBOX, DRIVE_PACKET_ID + numberToNXT(outAngle) + numberToNXT(outPower))).pipe(map(() => out));
            }
            return of(out).pipe(delay(100));
        }),
        map(deviceActions.startMotorHandler.success),
        catchError((err: PacketError) => of(deviceActions.startMotorHandler.failure(err))),
    );
export const writeConfig = (action$: ActionsObservable<RootAction>) =>
    action$.pipe(
        filter(isActionOf(deviceActions.writeConfig.request)),
        switchMap(({payload: config}: { payload: OutputConfig }) => {
            if (config.config == SteeringConfig.FRONT_STEERING) {
                return writePacket(MessageWrite.createPacket(
                    PACKET_MAILBOX,
                    CONFIG_PACKET_ID +
                    config.config +
                    config.frontOutputs.steeringPort +
                    config.frontOutputs.drivePort
                ));
            } else {
                return writePacket(MessageWrite.createPacket(
                    PACKET_MAILBOX,
                    CONFIG_PACKET_ID +
                    config.config +
                    config.tankOutputs.leftPort +
                    config.tankOutputs.rightPort
                ));
            }
        }),
        map(deviceActions.writeConfig.success),
        catchError((err: PacketError) => of(deviceActions.writeConfig.failure(err)))
    );

function numberToNXT(number: number) {
    let start = number < 0 ? "-" : "0";
    number = Math.abs(number);
    return start + Array(Math.max(3 - String(number).length + 1, 0)).join('0') + number;
}

export const startHandlers = (action$: ActionsObservable<RootAction>, state$: StateObservable<RootState>) =>
    action$.pipe(
        filter(isActionOf(deviceActions.writePacket.success)),
        filter(({payload: packet}) => packet instanceof StartProgram && packet.programName == SteeringControl),
        concatMap(() => [
                deviceActions.writeConfig.request(state$.value.device.outputConfig),
                startMotorHandler.request()
            ]
        )
    );
export const sendPacket = (action$: ActionsObservable<RootAction>) =>
    action$.pipe(
        filter(isActionOf(deviceActions.writePacket.request)),
        switchMap((action: { payload: Packet }) => writePacket(action.payload)),
        switchMap((action: Packet) => from(action.responseReceived)),
        map(deviceActions.writePacket.success),
        catchError((err: PacketError) => {
            if (err.packet instanceof StartProgram && err.packet.status == DirectCommandResponse.OUT_OF_RANGE) {
                let file = new NXTFile(err.packet.programName, fileList[err.packet.programName]);
                file.autoStart = true;
                if (file.name == SteeringControl) {
                    return from(new Promise(resolve => {
                        Alert.alert("Motor Control Program Missing", "The program for controlling NXT motors is missing on your NXT Device.\n\n" +
                            "Would you like to upload the NXT motor control program?\n" +
                            "Note that without this program, motor control will not work.", [
                            {text: "Upload Program", onPress: () => resolve(deviceActions.writeFile.request(file))},
                            {text: "Cancel", style: 'cancel'}
                        ]);
                    }))
                } else {
                    return of(deviceActions.writeFile.request(file));
                }
            }
            return of(deviceActions.writePacket.failure(err))
        })
    );

export const writeFile = (action$: ActionsObservable<RootAction>) => {
    //Baiscally, we handle writing a file here. We send out a openwrite, wait for it to respond and then
    //endlessly write (expand recursively calls itself) we then split into two branches and share the current result
    //between them.
    //The tap opens the file upload dialog whenever we upload a file.
    let actions = action$.pipe(
        filter(isActionOf(deviceActions.writeFile.request)),
        tap(() => Actions.push("status")),
        switchMap((action: { payload: NXTFile }) => writePacket(OpenWrite.createPacket(action.payload))),
        switchMap((packet: OpenWrite) => packet.responseReceived),
        switchMap((packet) => of(Write.createPacket((packet as OpenWrite).file))),
        expand((packet: Write) => {
            if (packet.file.hasWritten()) {
                return EMPTY;
            } else {
                return writePacket(packet);
            }
        }),
        share()
    );
    //We have one branch dealing with updating about the current progress, and another that handles tasks required after
    //the file is written.
    return merge(
        actions.pipe(
            filter(data => !data.file.hasWritten()),
            map(writeFileProgress),
            catchError((err: PacketError) => of(deviceActions.writeFile.failure(err))),
        ),
        actions.pipe(
            filter(data => data.file.hasWritten()),
            switchMap((packet: Write) => writePacket(Close.createPacket(packet.file))),
            switchMap((packet: Close) => {
                if (packet.file.autoStart) {
                    return writePacket(StartProgram.createPacket(packet.file.name));
                }
                return EMPTY;
            }),
            map(deviceActions.writeFile.success),
            catchError((err: PacketError) => of(deviceActions.writeFile.failure(err))),
        )
    )
};