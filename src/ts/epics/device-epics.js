import { isActionOf } from "typesafe-actions";
import { catchError, concatMap, expand, filter, map, share, switchMap, tap } from "rxjs/operators";
import { EMPTY, from, merge, of } from "rxjs";
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
import { EmptyPacket } from "../nxt-structure/packets/EmptyPacket";
/**
 * Write a packet to the device, and return an observer that will wait for the packet to be written
 * @param {Packet} packet the packet to write
 * @returns {Observable<Packet>} the observer
 */
export function writePacket(packet) {
    return from(ReactNativeBluetoothSerial.write(Buffer.from(packet.writePacket(true))).then(function () { return packet; }));
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
