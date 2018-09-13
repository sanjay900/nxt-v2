import {Epic} from "redux-observable";
import {isActionOf} from "typesafe-actions";
import {RootAction, RootState} from "../actions/types";
import {catchError, filter, map, switchMap} from "rxjs/operators";
import {from, of} from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import {Buffer} from "buffer";

import * as bluetoothActions from '../actions/bluetooth-actions';


export const requestDevices: Epic<RootAction, RootAction, RootState> = (action$) =>
    action$.pipe(
        filter(isActionOf(bluetoothActions.listDevices.request)),
        switchMap(() =>
            from(ReactNativeBluetoothSerial.list()).pipe(
                map(bluetoothActions.listDevices.success),
                catchError(err => of(bluetoothActions.listDevices.failure(err)))
            )
        )
    );

export const connectToDevice: Epic<RootAction, RootAction, RootState> = (action$) =>
    action$.pipe(
        filter(isActionOf(bluetoothActions.connectToDevice.request)),
        switchMap(action =>
            from(ReactNativeBluetoothSerial.connect(action.payload.id)).pipe(
                map(bluetoothActions.connectToDevice.success),
                catchError(err => of(bluetoothActions.connectToDevice.failure(err)))
            )
        )
    );

export const sendPacket: Epic<RootAction, RootAction, RootState> = (action$) =>
    action$.pipe(
        filter(isActionOf(bluetoothActions.writePacket.request)),
        switchMap(action => from(ReactNativeBluetoothSerial.write(Buffer.from(action.payload.writePacket(true)))).pipe(
            map(bluetoothActions.writePacket.success),
            catchError(err => of(bluetoothActions.writePacket.failure(err)))
            )
        )
    );