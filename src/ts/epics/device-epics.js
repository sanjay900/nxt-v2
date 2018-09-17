import { isActionOf } from "typesafe-actions";
import { catchError, expand, filter, map, switchMap } from "rxjs/operators";
import { EMPTY, from, of } from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import { Buffer } from "buffer";
import * as deviceActions from '../actions/device-actions';
import { Write } from "../nxt-structure/packets/system/write";
import { Close } from "../nxt-structure/packets/system/close";
import { OpenWrite } from "../nxt-structure/packets/system/open-write";
import { StartProgram } from "../nxt-structure/packets/direct/start-program";
/**
 * Write a packet to the device, and return an observer that will wait for the packet to be written
 * @param {Packet} packet the packet to write
 * @returns {Observable<Packet>} the observer
 */
function write(packet) {
    return from(ReactNativeBluetoothSerial.write(Buffer.from(packet.writePacket(true))).then(function () { return packet; }));
}
export var sendPacket = function (action$) {
    return action$.pipe(filter(isActionOf(deviceActions.writePacket.request)), switchMap(function (action) { return write(action.payload); }), switchMap(function (action) { return from(action.responseReceived); }), map(deviceActions.writePacket.success), catchError(function (err) { return of(deviceActions.writePacket.failure(err)); }));
};
export var writeFile = function (action$) {
    //Baiscally, we handle writing a file here. We send out a openwrite, wait for it to respond and then
    //endlessly write (expand recursively calls itself) until we have written the whole file, where we break
    //finish the file, and optionally start the file. We also capture all errors..
    return action$.pipe(filter(isActionOf(deviceActions.writeFile.request)), switchMap(function (action) { return write(OpenWrite.createPacket(action.payload)); }), switchMap(function (packet) { return packet.responseReceived; }), switchMap(function (packet) { return of(Write.createPacket(packet.file)); }), expand(function (packet) {
        if (packet.file.hasWritten()) {
            return EMPTY;
        }
        else {
            return write(packet);
        }
    }), filter(function (data) { return data.file.hasWritten(); }), switchMap(function (packet) { return write(Close.createPacket(packet.file)); }), switchMap(function (packet) {
        if (packet.file.autoStart) {
            return write(StartProgram.createPacket(packet.file.name));
        }
        return EMPTY;
    }), map(deviceActions.writeFile.success), catchError(function (err) { return of(deviceActions.writeFile.failure(err)); }));
};
