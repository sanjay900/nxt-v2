import {Epic} from "redux-observable";
import {isActionOf} from "typesafe-actions";
import {RootAction, RootState} from "../store";
import {catchError, expand, filter, map, switchMap} from "rxjs/operators";
import {from, of} from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import {Buffer} from "buffer";

import * as deviceActions from '../actions/device-actions';
import {Packet} from "../nxt-structure/packets/packet";
import {NXTFile} from "../nxt-structure/nxt-file";
import {Write} from "../nxt-structure/packets/system/write";
import {Close} from "../nxt-structure/packets/system/close";
import {OpenWrite} from "../nxt-structure/packets/system/open-write";
import {StartProgram} from "../nxt-structure/packets/direct/start-program";
import empty from "rxjs/observable/empty";

/**
 * Write a packet to the device, and return an observer that will wait for the packet to be written
 * @param {Packet} packet the packet to write
 * @returns {Observable<Packet>} the observer
 */
function write(packet: Packet) {
  return from(ReactNativeBluetoothSerial.write(Buffer.from(packet.writePacket(true))).then(() => packet));
}

export const sendPacket: Epic<RootAction, RootAction, RootState> = (action$) =>
  action$.pipe(
    filter(isActionOf(deviceActions.writePacket.request)),
    switchMap((action: { payload: Packet }) => write(action.payload)),
    switchMap((action: Packet) => from(action.responseRecieved)),
    map(deviceActions.writePacket.success),
    catchError(err => of(deviceActions.writePacket.failure(err)))
  );

export const setName: Epic<RootAction, RootAction, RootState> = (action$) =>
  action$.pipe(
    filter(isActionOf(deviceActions.setName.request)),
    switchMap(action => write(action.payload)),
    map(deviceActions.setName.success),
    catchError(err => of(deviceActions.setName.failure(err)))
  );
export const writeFile: Epic<RootAction, RootAction, RootState> = (action$) => {
  return action$.pipe(
    filter(isActionOf(deviceActions.writeFile.request)),
    switchMap(action => from(action.payload.readFile().then(()=>action.payload))),
    switchMap((file: NXTFile) => write(OpenWrite.createPacket(file))),
    switchMap((packet: OpenWrite) => packet.responseRecieved),
    switchMap((packet: OpenWrite) => of(Write.createPacket(packet.file))),
    expand((packet: Write) => {
      if (packet.file.hasWritten()) {
        return empty();
      } else {
        return write(packet);
      }
    }),
    switchMap((packet: Write) => write(Close.createPacket(packet.file))),
    switchMap((packet: Close) => {
      if (packet.file.autoStart) {
        return write(StartProgram.createPacket(packet.file.name));
      }
    }),
    map(deviceActions.writeFile.success),
    catchError(err => of(deviceActions.writeFile.failure(err)))
  )
};