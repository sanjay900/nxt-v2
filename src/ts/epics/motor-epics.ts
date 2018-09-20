import {ActionsObservable, StateObservable} from "redux-observable";
import {RootAction, RootState} from "../store";
import {catchError, delay, expand, filter, map, switchMap} from "rxjs/operators";
import {isActionOf} from "typesafe-actions";
import * as deviceActions from "../actions/device-actions";
import {ConnectionStatus} from "../reducers/bluetooth";
import {EMPTY, of} from "rxjs";
import {SteeringConfig} from "../nxt-structure/motor-constants";
import {MessageWrite} from "../nxt-structure/packets/direct/message-write";
import {OutputConfig, PacketError} from "../reducers/device";
import {EmptyPacket} from "../nxt-structure/packets/empty-packet";
import {writePacket} from "./device-epics";

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
        map(deviceActions.startMotorHandler.success),
        catchError((err: PacketError) => of(deviceActions.startMotorHandler.failure(err))),
        catchError((err: Error) => of(deviceActions.startMotorHandler.failure({
            error: err,
            packet: EmptyPacket.createPacket()
        }))),
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
        catchError((err: PacketError) => of(deviceActions.writeConfig.failure(err))),
        catchError((err: Error) => of(deviceActions.writeConfig.failure({
            error: err,
            packet: EmptyPacket.createPacket()
        })))
    );

function numberToNXT(number: number) {
    let start = number < 0 ? "-" : "0";
    number = Math.abs(number);
    return start + Array(Math.max(3 - String(number).length + 1, 0)).join('0') + number;
}