import { isActionOf } from "typesafe-actions";
import { catchError, concatMap, delay, expand, filter, map, share, switchMap, tap } from "rxjs/operators";
import { empty, EMPTY, from, merge, of } from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import { Buffer } from "buffer";
import * as deviceActions from '../actions/device-actions';
import { startMotorHandler, writeFileProgress } from '../actions/device-actions';
import { NXTFile } from "../nxt-structure/nxt-file";
import { Write } from "../nxt-structure/packets/system/write";
import { Close } from "../nxt-structure/packets/system/close";
import { OpenWrite } from "../nxt-structure/packets/system/open-write";
import { StartProgram } from "../nxt-structure/packets/direct/start-program";
import { Actions } from "react-native-router-flux";
import { DirectCommandResponse } from "../nxt-structure/packets/direct-command-response";
import { Alert } from "react-native";
import { fileList, SteeringControl } from "../utils/Files";
import { ConnectionStatus } from "../reducers/bluetooth";
import { SteeringConfig } from "../nxt-structure/motor/motor-constants";
import { MessageWrite } from "../nxt-structure/packets/direct/message-write";
import { EmptyPacket } from "../nxt-structure/packets/EmptyPacket";
import { InputSensorMode, InputSensorType, SensorType } from "../nxt-structure/sensor/sensor";
import { UltrasonicSensorRegister } from "../nxt-structure/sensor/i2c-register";
import { LsWrite } from "../nxt-structure/packets/direct/ls-write";
import { LsGetStatus } from "../nxt-structure/packets/direct/ls-get-status";
import { LsRead } from "../nxt-structure/packets/direct/ls-read";
import { GetInputValues } from "../nxt-structure/packets/direct/get-input-values";
/**
 * Write a packet to the device, and return an observer that will wait for the packet to be written
 * @param {Packet} packet the packet to write
 * @returns {Observable<Packet>} the observer
 */
function writePacket(packet) {
    return from(ReactNativeBluetoothSerial.write(Buffer.from(packet.writePacket(true))).then(function () { return packet; }));
}
var CONFIG_PACKET_ID = "B";
var DRIVE_PACKET_ID = "A";
var PACKET_MAILBOX = 0;
var CM_TO_INCH = 0.393700;
var TYPE_TO_MODE = new Map([
    [SensorType.SOUND_DB, InputSensorMode.RAW],
    [SensorType.SOUND_DBA, InputSensorMode.RAW],
    [SensorType.LIGHT_ACTIVE, InputSensorMode.RAW],
    [SensorType.LIGHT_INACTIVE, InputSensorMode.RAW],
    [SensorType.TOUCH, InputSensorMode.BOOLEAN],
    [SensorType.ULTRASONIC_INCH, InputSensorMode.RAW],
    [SensorType.ULTRASONIC_CM, InputSensorMode.RAW],
]);
var TYPE_TO_TYPE = new Map([
    [SensorType.SOUND_DB, InputSensorType.SOUND_DB],
    [SensorType.SOUND_DBA, InputSensorType.SOUND_DBA],
    [SensorType.TOUCH, InputSensorType.TOUCH],
    [SensorType.LIGHT_ACTIVE, InputSensorType.LIGHT_ACTIVE],
    [SensorType.LIGHT_INACTIVE, InputSensorType.LIGHT_INACTIVE],
    [SensorType.ULTRASONIC_INCH, InputSensorType.LOW_SPEED_9V],
    [SensorType.ULTRASONIC_CM, InputSensorType.LOW_SPEED_9V],
]);
export var motorHandler = function (action$, state$) {
    return action$.pipe(filter(isActionOf(deviceActions.startMotorHandler.request)), map(function () { return state$.value.device.outputConfig; }), expand(function (prevOut) {
        var state = state$.value;
        var out = state.device.outputConfig;
        if (state.bluetooth.status == ConnectionStatus.DISCONNECTED) {
            return empty();
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
export var sensorHandler = function (action$, state$) {
    return action$.pipe(filter(isActionOf(deviceActions.sensorHandler.request)), map(function () { return state$.value.device.outputConfig; }), expand(function (data) {
        //TODO: maybe we should keep track of the orignal state, and init sensors if the sensor type changes?
        //TODO: or we just have a seperate update epic?
        //TODO: also, we should
        var state = state$.value;
        if (state.bluetooth.status == ConnectionStatus.DISCONNECTED) {
            return empty();
        }
        return merge(tickSensor(1, state$), tickSensor(2, state$), tickSensor(3, state$), tickSensor(4, state$)).pipe(delay(100));
    }), map(deviceActions.sensorHandlerProgress), catchError(function (err) { return of(deviceActions.startMotorHandler.failure(err)); }), catchError(function (err) { return of(deviceActions.startMotorHandler.failure({
        error: err,
        packet: EmptyPacket.createPacket()
    })); }));
};
function readI2CRegister(register, port) {
    return writePacket(LsWrite.createPacket(port, [0x02, register], 1)).pipe(function () { return writePacket(LsGetStatus.createPacket(port)); }, filter(function (packet) { return packet.bytesReady > 0; }), function () { return writePacket(LsRead.createPacket(port)); }, map(function (packet) { return ({ rawValue: packet.rxData[0], scaledValue: packet.rxData[0], port: port }); }));
}
function tickSensor(port, state$) {
    var sensor = state$.value.device.inputs[port];
    var pipe = of(state$.value.device.outputConfig).pipe(filter(function () { return sensor.type != SensorType.NONE; }), share());
    return merge(pipe.pipe(filter(function () { return sensor.type == SensorType.ULTRASONIC_CM || sensor.type == SensorType.ULTRASONIC_INCH; }), function () { return readI2CRegister(UltrasonicSensorRegister.MEASUREMENT_BYTE_0, port); }), pipe.pipe(filter(function () { return sensor.type != SensorType.ULTRASONIC_CM && sensor.type != SensorType.ULTRASONIC_INCH; }), function () { return writePacket(GetInputValues.createPacket(port)); }, map(function (packet) { return ({ rawValue: packet.rawValue, scaledValue: packet.scaledValue, port: port }); })));
}
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
export var startHandlers = function (action$, state$) {
    return action$.pipe(filter(isActionOf(deviceActions.writePacket.success)), filter(function (_a) {
        var packet = _a.payload;
        return packet instanceof StartProgram && packet.programName == SteeringControl;
    }), concatMap(function () { return [
        deviceActions.writeConfig.request(state$.value.device.outputConfig),
        startMotorHandler.request()
    ]; }));
};
function askToUpload(file) {
    return new Promise(function (resolve) {
        Alert.alert("Motor Control Program Missing", "The program for controlling NXT motors is missing on your NXT Device.\n\n" +
            "Would you like to upload the NXT motor control program?\n" +
            "Note that without this program, motor control will not work.", [
            { text: "Upload Program", onPress: function () { return resolve(deviceActions.writeFile.request(file)); } },
            { text: "Cancel", style: 'cancel' }
        ]);
    });
}
export var sendPacket = function (action$) {
    return action$.pipe(filter(isActionOf(deviceActions.writePacket.request)), switchMap(function (action) { return writePacket(action.payload); }), switchMap(function (action) { return from(action.responseReceived); }), map(deviceActions.writePacket.success), catchError(function (err) {
        //If the user asks to start a program, and it is missing on the device, we get an out_of_range error.
        //In this case, we either ask them to upload the motor control program, or if they are running their
        //own program, then we just upload it anyways.
        if (err.packet instanceof StartProgram && err.packet.status == DirectCommandResponse.OUT_OF_RANGE) {
            var file = new NXTFile(err.packet.programName, fileList[err.packet.programName]);
            file.autoStart = true;
            if (file.name == SteeringControl) {
                return from(askToUpload(file));
            }
            else {
                return of(deviceActions.writeFile.request(file));
            }
        }
        return of(deviceActions.writePacket.failure(err));
    }), catchError(function (err) { return of(deviceActions.writeConfig.failure({
        error: err,
        packet: EmptyPacket.createPacket()
    })); }));
};
export var writeFile = function (action$) {
    //Baiscally, we handle writing a file here. We send out a openwrite, wait for it to respond and then
    //endlessly write (expand recursively calls itself) we then split into two branches and share the current result
    //between them.
    //The tap opens the file upload dialog whenever we upload a file.
    var actions = action$.pipe(filter(isActionOf(deviceActions.writeFile.request)), tap(function () { return Actions.push("status"); }), switchMap(function (action) { return writePacket(OpenWrite.createPacket(action.payload)); }), switchMap(function (packet) { return packet.responseReceived; }), switchMap(function (packet) { return of(Write.createPacket(packet.file)); }), expand(function (packet) {
        if (packet.file.hasWritten()) {
            return EMPTY;
        }
        else {
            return writePacket(packet);
        }
    }), share());
    //We have one branch dealing with updating about the current progress, and another that handles tasks required after
    //the file is written.
    return merge(actions.pipe(filter(function (data) { return !data.file.hasWritten(); }), map(writeFileProgress), catchError(function (err) { return of(deviceActions.writeFile.failure(err)); }), catchError(function (err) { return of(deviceActions.writeConfig.failure({
        error: err,
        packet: EmptyPacket.createPacket()
    })); })), actions.pipe(filter(function (data) { return data.file.hasWritten(); }), switchMap(function (packet) { return writePacket(Close.createPacket(packet.file)); }), switchMap(function (packet) {
        if (packet.file.autoStart) {
            return writePacket(StartProgram.createPacket(packet.file.name));
        }
        return EMPTY;
    }), map(deviceActions.writeFile.success), catchError(function (err) { return of(deviceActions.writeFile.failure(err)); }), catchError(function (err) { return of(deviceActions.writeConfig.failure({
        error: err,
        packet: EmptyPacket.createPacket()
    })); })));
};
