import { ConnectionStatus } from "../store";
import { catchError, delay, expand, filter, map, switchMap } from "rxjs/operators";
import { isActionOf } from "typesafe-actions";
import * as deviceActions from "../actions/device-actions";
import { EMPTY, of } from "rxjs";
import { SteeringConfig } from "../nxt-structure/motor-constants";
import { MessageWrite } from "../nxt-structure/packets/direct/message-write";
import { EmptyPacket } from "../nxt-structure/packets/empty-packet";
import { writePacket } from "./device-epics";
var CONFIG_PACKET_ID = "B";
var DRIVE_PACKET_ID = "A";
var PACKET_MAILBOX = 0;
export var motorHandler = function (action$, state$) {
    return action$.pipe(filter(isActionOf(deviceActions.startMotorHandler.request)), map(function () { return state$.value.device.outputConfig; }), expand(function (prevOut) {
        var state = state$.value;
        var out = state.device.outputConfig;
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
            var outAngle = out.targetAngle * (out.invertSteering ? -1 : 1);
            var outPower = out.power * (out.invertThrottle ? -1 : 1);
            return writePacket(MessageWrite.createPacket(PACKET_MAILBOX, DRIVE_PACKET_ID + numberToNXT(outAngle) + numberToNXT(outPower))).pipe(map(function () { return out; }));
        }
        return of(out).pipe(delay(100));
    }), map(deviceActions.startMotorHandler.success), catchError(function (err) { return of(deviceActions.startMotorHandler.failure(err)); }), catchError(function (err) { return of(deviceActions.startMotorHandler.failure({
        error: err,
        packet: EmptyPacket.createPacket()
    })); }));
};
export var writeConfig = function (action$) {
    return action$.pipe(filter(isActionOf(deviceActions.writeConfig.request)), switchMap(function (_a) {
        var config = _a.payload;
        if (config.config == SteeringConfig.FRONT_STEERING) {
            return writePacket(MessageWrite.createPacket(PACKET_MAILBOX, CONFIG_PACKET_ID +
                config.config +
                config.frontOutputs.steeringPort +
                config.frontOutputs.drivePort));
        }
        else {
            return writePacket(MessageWrite.createPacket(PACKET_MAILBOX, CONFIG_PACKET_ID +
                config.config +
                config.tankOutputs.leftPort +
                config.tankOutputs.rightPort));
        }
    }), map(deviceActions.writeConfig.success), catchError(function (err) { return of(deviceActions.writeConfig.failure(err)); }), catchError(function (err) { return of(deviceActions.writeConfig.failure({
        error: err,
        packet: EmptyPacket.createPacket()
    })); }));
};
function numberToNXT(number) {
    var start = number < 0 ? "-" : "0";
    number = Math.abs(number);
    return start + Array(Math.max(3 - String(number).length + 1, 0)).join('0') + number;
}
