import {ActionsObservable, Epic} from "redux-observable";
import {isActionOf} from "typesafe-actions";
import {RootAction, RootState} from "../store";
import {catchError, expand, filter, map, switchMap} from "rxjs/operators";
import {EMPTY, from, Observable, of} from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import {Buffer} from "buffer";

import * as deviceActions from '../actions/device-actions';
import {Packet} from "../nxt-structure/packets/packet";
import {NXTFile} from "../nxt-structure/nxt-file";
import {Write} from "../nxt-structure/packets/system/write";
import {Close} from "../nxt-structure/packets/system/close";
import {OpenWrite} from "../nxt-structure/packets/system/open-write";
import {StartProgram} from "../nxt-structure/packets/direct/start-program";

/**
 * Write a packet to the device, and return an observer that will wait for the packet to be written
 * @param {Packet} packet the packet to write
 * @returns {Observable<Packet>} the observer
 */
function write<T extends Packet>(packet: T): Observable<T> {
    return from(ReactNativeBluetoothSerial.write(Buffer.from(packet.writePacket(true))).then(() => packet));
}

export const sendPacket: Epic<RootAction, RootAction, RootState> = (action$) =>
    action$.pipe(
        filter(isActionOf(deviceActions.writePacket.request)),
        switchMap((action: { payload: Packet }) => write(action.payload)),
        switchMap((action: Packet) => from(action.responseReceived)),
        map(deviceActions.writePacket.success),
        catchError(err => of(deviceActions.writePacket.failure(err)))
    );
export const writeFile = (action$: ActionsObservable<RootAction>) => {
    //Baiscally, we handle writing a file here. We send out a openwrite, wait for it to respond and then
    //endlessly write (expand recursively calls itself) until we have written the whole file, where we break
    //finish the file, and optionally start the file. We also capture all errors..
    return action$.pipe(
        filter(isActionOf(deviceActions.writeFile.request)),
        switchMap((action: { payload: NXTFile }) => write(OpenWrite.createPacket(action.payload))),
        switchMap((packet: OpenWrite) => packet.responseReceived),
        switchMap((packet) => of(Write.createPacket((packet as OpenWrite).file))),
        expand((packet: Write) => {
            if (packet.file.hasWritten()) {
                return EMPTY;
            } else {
                return write(packet);
            }
        }),
        filter(data => data.file.hasWritten()),
        switchMap((packet: Write) => write(Close.createPacket(packet.file))),
        switchMap((packet: Close) => {
            if (packet.file.autoStart) {
                return write(StartProgram.createPacket(packet.file.name));
            }
            return EMPTY
        }),
        map(deviceActions.writeFile.success),
        catchError(err => of(deviceActions.writeFile.failure(err)))
    )
};