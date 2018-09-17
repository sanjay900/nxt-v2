import {ActionsObservable, Epic} from "redux-observable";
import {isActionOf} from "typesafe-actions";
import {RootAction, RootState} from "../store";
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
import {Actions} from "react-native-router-flux";

/**
 * Write a packet to the device, and return an observer that will wait for the packet to be written
 * @param {Packet} packet the packet to write
 * @returns {Observable<Packet>} the observer
 */
function writePacket<T extends Packet>(packet: T): Observable<T> {
    return from(ReactNativeBluetoothSerial.write(Buffer.from(packet.writePacket(true))).then(() => packet));
}

export const sendPacket: Epic<RootAction, RootAction, RootState> = (action$) =>
    action$.pipe(
        filter(isActionOf(deviceActions.writePacket.request)),
        switchMap((action: { payload: Packet }) => writePacket(action.payload)),
        switchMap((action: Packet) => from(action.responseReceived)),
        map(deviceActions.writePacket.success),
        catchError(err => of(deviceActions.writePacket.failure(err)))
    );
export const writeFile = (action$: ActionsObservable<RootAction>) => {
    //Baiscally, we handle writing a file here. We send out a openwrite, wait for it to respond and then
    //endlessly write (expand recursively calls itself) we then split into two branches and share the current result
    //between them
    let actions = action$.pipe(
        filter(isActionOf(deviceActions.writeFile.request)),
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
            catchError(err => of(deviceActions.writeFile.failure(err))),
        ),
        actions.pipe(
            filter(data => data.file.hasWritten()),
            switchMap((packet: Write) => writePacket(Close.createPacket(packet.file))),
            switchMap((packet: Close) => {
                if (packet.file.autoStart) {
                    return writePacket(StartProgram.createPacket(packet.file.name));
                }
                return EMPTY
            }),
            map(deviceActions.writeFile.success),
            catchError(err => of(deviceActions.writeFile.failure(err))),
        )
    )
};