import {ActionsObservable} from "redux-observable";
import {isActionOf} from "typesafe-actions";
import {RootAction} from "../store";
import {catchError, expand, filter, map, share, switchMap, tap} from "rxjs/operators";
import {EMPTY, from, merge, Observable, of} from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import {Buffer} from "buffer";

import * as deviceActions from '../actions/device-actions';
import {writeFileProgress} from '../actions/device-actions';
import {Packet} from "../nxt-structure/packets/packet";
import {NXTFile} from "../nxt-structure/nxt-file";
import {Write} from "../nxt-structure/packets/system/write";
import {Close} from "../nxt-structure/packets/system/close";
import {OpenWrite} from "../nxt-structure/packets/system/open-write";
import {StartProgram} from "../nxt-structure/packets/direct/start-program";
import {PacketError} from "../reducers/device";
import {Actions} from "react-native-router-flux";
import {DirectCommandResponse} from "../nxt-structure/packets/direct-command-response";
import {Alert} from "react-native";
import {fileList, SteeringControl} from "../utils/Files";

/**
 * Write a packet to the device, and return an observer that will wait for the packet to be written
 * @param {Packet} packet the packet to write
 * @returns {Observable<Packet>} the observer
 */
function writePacket<T extends Packet>(packet: T): Observable<T> {
    return from(ReactNativeBluetoothSerial.write(Buffer.from(packet.writePacket(true))).then(() => packet));
}

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