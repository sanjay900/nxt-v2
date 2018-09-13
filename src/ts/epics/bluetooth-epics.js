import { isActionOf } from "typesafe-actions";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { from, of } from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import { Buffer } from "buffer";
import * as bluetoothActions from '../actions/bluetooth-actions';
export var requestDevices = function (action$) {
    return action$.pipe(filter(isActionOf(bluetoothActions.listDevices.request)), switchMap(function () {
        return from(ReactNativeBluetoothSerial.list()).pipe(map(bluetoothActions.listDevices.success), catchError(function (err) { return of(bluetoothActions.listDevices.failure(err)); }));
    }));
};
export var connectToDevice = function (action$) {
    return action$.pipe(filter(isActionOf(bluetoothActions.connectToDevice.request)), switchMap(function (action) {
        return from(ReactNativeBluetoothSerial.connect(action.payload.id)).pipe(map(bluetoothActions.connectToDevice.success), catchError(function (err) { return of(bluetoothActions.connectToDevice.failure(err)); }));
    }));
};
export var sendPacket = function (action$) {
    return action$.pipe(filter(isActionOf(bluetoothActions.writePacket.request)), switchMap(function (action) { return from(ReactNativeBluetoothSerial.write(Buffer.from(action.payload.writePacket(true)))).pipe(map(bluetoothActions.writePacket.success), catchError(function (err) { return of(bluetoothActions.writePacket.failure(err)); })); }));
};
