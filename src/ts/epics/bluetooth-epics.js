import { isActionOf } from "typesafe-actions";
import { catchError, concatMap, filter, map, switchMap } from "rxjs/operators";
import { from, of } from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import * as bluetoothActions from '../actions/bluetooth-actions';
import * as deviceActions from "../actions/device-actions";
import * as sensorActions from "../actions/sensor-actions";
import * as motorActions from "../actions/motor-actions";
import { writePacket } from "../actions/device-actions";
import { GetBatteryLevel } from "../nxt-structure/packets/direct/get-battery-level";
import { GetDeviceInfo } from "../nxt-structure/packets/system/get-device-info";
import { GetFirmwareVersion } from "../nxt-structure/packets/system/get-firmware-version";
import { SteeringControl } from "../utils/Files";
import { StartProgram } from "../nxt-structure/packets/direct/start-program";
export var requestDevices = function (action$) {
    return action$.pipe(filter(isActionOf(bluetoothActions.listDevices.request)), switchMap(function () {
        return from(ReactNativeBluetoothSerial.list()).pipe(map(bluetoothActions.listDevices.success), catchError(function (err) { return of(bluetoothActions.listDevices.failure(err)); }));
    }));
};
export var connectToDevice = function (action$) {
    return action$.pipe(filter(isActionOf(bluetoothActions.connectToDevice.request)), switchMap(function (action) { return from(ReactNativeBluetoothSerial.connect(action.payload.id)); }), concatMap(function () { return [
        bluetoothActions.connectToDevice.success(),
        writePacket.request(GetBatteryLevel.createPacket()),
        writePacket.request(GetDeviceInfo.createPacket()),
        writePacket.request(GetFirmwareVersion.createPacket()),
        writePacket.request(StartProgram.createPacket(SteeringControl)),
        sensorActions.sensorHandler.request(),
        motorActions.startMotorListener.request(),
        deviceActions.startInfoListener.request()
    ]; }), catchError(function (err) { return of(bluetoothActions.connectToDevice.failure(err)); }));
};
export var disconnectFromDevice = function (action$) {
    return action$.pipe(filter(isActionOf(bluetoothActions.disconnectFromDevice.request)), switchMap(function () {
        return from(ReactNativeBluetoothSerial.disconnect()).pipe(map(bluetoothActions.disconnectFromDevice.success), catchError(function (err) { return of(bluetoothActions.disconnectFromDevice.failure(err)); }));
    }));
};
