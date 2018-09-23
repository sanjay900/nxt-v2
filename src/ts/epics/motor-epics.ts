import {ActionsObservable, StateObservable} from "redux-observable";
import {ConnectionStatus, OutputConfig, RootAction, RootState} from "../store";
import {catchError, concatMap, delay, expand, filter, map, switchMap} from "rxjs/operators";
import {isActionOf} from "typesafe-actions";
import * as motorActions from "../actions/motor-actions";
import {EMPTY, NEVER, of} from "rxjs";
import {SteeringConfig, SystemOutputPort} from "../nxt-structure/motor-constants";
import {MessageWrite} from "../nxt-structure/packets/direct/message-write";
import {initialOutput, PacketError} from "../reducers/device";
import {EmptyPacket} from "../nxt-structure/packets/empty-packet";
import {writePacket} from "./device-epics";
import {GetOutputState} from "../nxt-structure/packets/direct/get-output-state";
import * as deviceActions from "../actions/device-actions";
import {StartProgram} from "../nxt-structure/packets/direct/start-program";
import {SteeringControl} from "../utils/Files";

const CONFIG_PACKET_ID = "B";
const DRIVE_PACKET_ID = "A";
const PACKET_MAILBOX = 0;
export const motorHandler = (action$: ActionsObservable<RootAction>, state$: StateObservable<RootState>) =>
    action$.pipe(
        filter(isActionOf(motorActions.startMotorHandler.request)),
        map(() => state$.value.device.outputConfig),
        expand(prevOut => {
            let state = state$.value;
            let out = state.device.outputConfig;
            if (state.bluetooth.status == ConnectionStatus.DISCONNECTED) {
                return EMPTY;
            }
            if (out.config == SteeringConfig.TANK && (!out.tankOutputs.leftPort || !out.tankOutputs.rightPort)) {
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
        map(motorActions.startMotorHandler.success),
        catchError((err: PacketError) => of(motorActions.startMotorHandler.failure(err))),
        catchError((err: Error) => of(motorActions.startMotorHandler.failure({
            error: err,
            packet: EmptyPacket.createPacket()
        }))),
    );

export const motorListener = (action$: ActionsObservable<RootAction>, state$: StateObservable<RootState>) =>
    action$.pipe(
        filter(isActionOf(motorActions.startMotorListener.request)),
        switchMap(() => [SystemOutputPort.A, SystemOutputPort.B, SystemOutputPort.C]),
        map(port => (initialOutput(port).data)),
        expand(port => {
            let state = state$.value;
            if (state.bluetooth.status == ConnectionStatus.DISCONNECTED) {
                return EMPTY;
            }
            if (!state.device.outputs[SystemOutputPort[port.port]].listening) {
                return of(initialOutput(port.port).data).pipe(delay(0));
            }
            return of(port).pipe(
                switchMap(() => writePacket(GetOutputState.createPacket(port.port))),
                map(packet => (packet.toOutputData()))
            );
        }),
        map(motorActions.motorUpdate),
        catchError((err: PacketError) => of(motorActions.startMotorListener.failure(err))),
        catchError((err: Error) => of(motorActions.startMotorListener.failure({
            error: err,
            packet: EmptyPacket.createPacket()
        }))),
    );

export const writeConfig = (action$: ActionsObservable<RootAction>) =>
    action$.pipe(
        filter(isActionOf(motorActions.writeConfig.request)),
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
        map(motorActions.writeConfig.success),
        catchError((err: PacketError) => of(motorActions.writeConfig.failure(err))),
        catchError((err: Error) => of(motorActions.writeConfig.failure({
            error: err,
            packet: EmptyPacket.createPacket()
        })))
    );

function numberToNXT(number: number) {
    let start = number < 0 ? "-" : "0";
    number = Math.round(number);
    number = Math.abs(number);
    return start + Array(Math.max(3 - String(number).length + 1, 0)).join('0') + number;
}

export const startHandlers = (action$: ActionsObservable<RootAction>, state$: StateObservable<RootState>) =>
    action$.pipe(
        map(action => {
            return (isActionOf(deviceActions.writePacket.success)(action) && action.payload instanceof StartProgram && action.payload.programName) ||
                (isActionOf(deviceActions.writeFile.success)(action) && action.payload.name) ||
                NEVER;
        }),
        filter(name => name == SteeringControl),
        concatMap(() => [
                motorActions.writeConfig.request(state$.value.device.outputConfig),
                motorActions.startMotorHandler.request()
            ]
        )
    );