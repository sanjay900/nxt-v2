import { ConnectionStatus } from "../store";
import { EMPTY, merge, of } from "rxjs";
import { InputSensorMode, InputSensorType, SensorType } from "../nxt-structure/sensor-constants";
import { catchError, delay, expand, filter, map, share, switchMap } from "rxjs/operators";
import { UltrasonicSensorRegister } from "../nxt-structure/i2c-register";
import { GetInputValues } from "../nxt-structure/packets/direct/get-input-values";
import { LsWrite } from "../nxt-structure/packets/direct/ls-write";
import { LsGetStatus } from "../nxt-structure/packets/direct/ls-get-status";
import { LsRead } from "../nxt-structure/packets/direct/ls-read";
import { writePacket } from "./device-epics";
import { isActionOf } from "typesafe-actions";
import * as sensorActions from "../actions/sensor-actions";
import { UltrasonicSensorCommand } from "../nxt-structure/ultrasonic-sensor-command";
import { initialSensor } from "../reducers/device";
import { EmptyPacket } from "../nxt-structure/packets/empty-packet";
import { SetInputMode } from "../nxt-structure/packets/direct/set-input-mode";
var CM_TO_INCH = 0.393700;
export var TYPE_TO_MODE = new Map([
    [SensorType.SOUND_DB, InputSensorMode.RAW],
    [SensorType.SOUND_DBA, InputSensorMode.RAW],
    [SensorType.LIGHT_ACTIVE, InputSensorMode.RAW],
    [SensorType.LIGHT_INACTIVE, InputSensorMode.RAW],
    [SensorType.TOUCH, InputSensorMode.BOOLEAN],
    [SensorType.ULTRASONIC_INCH, InputSensorMode.RAW],
    [SensorType.ULTRASONIC_CM, InputSensorMode.RAW],
]);
export var TYPE_TO_TYPE = new Map([
    [SensorType.SOUND_DB, InputSensorType.SOUND_DB],
    [SensorType.SOUND_DBA, InputSensorType.SOUND_DBA],
    [SensorType.TOUCH, InputSensorType.TOUCH],
    [SensorType.LIGHT_ACTIVE, InputSensorType.LIGHT_ACTIVE],
    [SensorType.LIGHT_INACTIVE, InputSensorType.LIGHT_INACTIVE],
    [SensorType.ULTRASONIC_INCH, InputSensorType.LOW_SPEED_9V],
    [SensorType.ULTRASONIC_CM, InputSensorType.LOW_SPEED_9V],
]);
function writeConfigPacket(config) {
    var sensor = {
        type: config.sensorType,
        systemType: TYPE_TO_TYPE.get(config.sensorType),
        mode: TYPE_TO_MODE.get(config.sensorType),
        data: {
            rawValue: 0,
            scaledValue: 0,
            port: config.port
        },
        dataHistory: [],
        enabled: true
    };
    return writePacket(SetInputMode.createPacket(config.port, sensor.systemType, sensor.mode)).pipe(map(function () { return ({
        port: config.port,
        sensorType: sensor
    }); }));
}
export var sensorConfig = function (action$) {
    return action$.pipe(filter(isActionOf(sensorActions.sensorConfig.request)), switchMap(function (_a) {
        var config = _a.payload;
        return of(config);
    }), switchMap(writeConfigPacket), switchMap(function (config) {
        if (config.sensorType.type == SensorType.ULTRASONIC_CM || config.sensorType.type == SensorType.ULTRASONIC_INCH) {
            return writePacket(LsWrite.createPacket(config.port, [0x02, UltrasonicSensorRegister.COMMAND, UltrasonicSensorCommand.CONTINUOUS_MEASUREMENT], 0)).pipe(map(function () { return config; }));
        }
        else {
            return of(config);
        }
    }), map(sensorActions.sensorConfig.success), catchError(function (err) { return of(sensorActions.sensorConfig.failure(err)); }), catchError(function (err) { return of(sensorActions.sensorConfig.failure({
        error: err,
        packet: EmptyPacket.createPacket()
    })); }));
};
export var sensorHandler = function (action$, state$) {
    return action$.pipe(filter(isActionOf(sensorActions.sensorHandler.request)), switchMap(function () { return [1, 2, 3, 4]; }), map(function (port) { return ({ port: port, sensorType: state$.value.device.inputs[port].type }); }), switchMap(function (port) { return writeConfigPacket(port).pipe(map(function (_a) {
        var port = _a.port;
        return initialSensor(port).data;
    })); }), expand(function (port) {
        var state = state$.value;
        if (state.bluetooth.status == ConnectionStatus.DISCONNECTED) {
            return EMPTY;
        }
        return of(port).pipe(delay(0), switchMap(function () { return tickSensor(port.port, state$); }), catchError(function () {
            //Digital sensors return errors to tell you you cannot read from them, so instead of passing those errors to the user,
            //its better to silence them and not return data
            return of({ rawValue: -1, scaledValue: -1, port: port.port });
        }));
    }), filter(function (data) { return data.rawValue >= 0; }), 
    //Unwrap the observable returned by tickSensor
    map(sensorActions.sensorUpdate), catchError(function (err) { return of(sensorActions.sensorHandler.failure(err)); }), catchError(function (err) { return of(sensorActions.sensorHandler.failure({
        error: err,
        packet: EmptyPacket.createPacket()
    })); }));
};
function readI2CRegister(register, port) {
    var p = of(port).pipe(switchMap(function () { return writePacket(LsWrite.createPacket(port, [0x02, register], 1)); }), switchMap(function () { return writePacket(LsGetStatus.createPacket(port)); }), share());
    return merge(p.pipe(filter(function (packet) { return packet.bytesReady > 0; }), switchMap(function () { return writePacket(LsRead.createPacket(port)); }), map(function (packet) { return ({ rawValue: packet.rxData[0], scaledValue: packet.rxData[0], port: port }); })), p.pipe(filter(function (packet) { return packet.bytesReady == 0; }), 
    //If the sensor isnt ready, we can just ignore its data
    map(function () { return ({ rawValue: -1, scaledValue: -1, port: port }); })));
}
function isUltrasonic(type) {
    return type == SensorType.ULTRASONIC_INCH || type == SensorType.ULTRASONIC_CM;
}
export function tickSensor(port, state$) {
    var p = of(state$.value.device.inputs[port]).pipe(share());
    //Merge together the possibilities for each type of sensor tick
    return merge(p.pipe(filter(function (sensor) { return sensor.type == SensorType.NONE || !sensor.enabled; }), map(function () { return ({ rawValue: -1, scaledValue: -1, port: port }); })), p.pipe(filter(function (sensor) { return isUltrasonic(sensor.type) && sensor.enabled; }), switchMap(function () { return readI2CRegister(UltrasonicSensorRegister.MEASUREMENT_BYTE_0, port); }), map(function (data) {
        var scale = state$.value.device.inputs[port].type == SensorType.ULTRASONIC_INCH ? CM_TO_INCH : 1;
        return { scaledValue: data.scaledValue * scale, rawValue: data.rawValue, port: port };
    })), p.pipe(filter(function (sensor) { return sensor.type != SensorType.NONE && !isUltrasonic(sensor.type) && sensor.enabled; }), switchMap(function () { return writePacket(GetInputValues.createPacket(port)); }), map(function (packet) { return ({
        rawValue: packet.rawValue,
        scaledValue: packet.scaledValue,
        port: port
    }); })));
}
