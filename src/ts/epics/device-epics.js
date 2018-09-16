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
import { SetBrickName } from "../nxt-structure/packets/system/set-brick-name";
/**
 * Write a packet to the device, and return an observer that will wait for the packet to be written
 * @param {Packet} packet the packet to write
 * @returns {Observable<Packet>} the observer
 */
function write(packet) {
    return from(ReactNativeBluetoothSerial.write(Buffer.from(packet.writePacket(true))).then(function () { return packet; }));
}
export var sendPacket = function (action$) {
    return action$.pipe(filter(isActionOf(deviceActions.writePacket.request)), switchMap(function (action) { return write(action.payload); }), switchMap(function (action) { return from(action.responseRecieved); }), map(deviceActions.writePacket.success), catchError(function (err) { return of(deviceActions.writePacket.failure(err)); }));
};
export var setName = function (action$) {
    return action$.pipe(filter(isActionOf(deviceActions.setName.request)), switchMap(function (action) { return write(SetBrickName.createPacket(action.payload)); }), map(deviceActions.setName.success), catchError(function (err) { return of(deviceActions.setName.failure(err)); }));
};
export var writeFile = function (action$) {
    return action$.pipe(filter(isActionOf(deviceActions.writeFile.request)), switchMap(function (action) { return write(OpenWrite.createPacket(action.payload)); }), switchMap(function (packet) { return packet.responseRecieved; }), switchMap(function (packet) { return of(Write.createPacket(packet.file)); }), expand(function (packet) {
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
