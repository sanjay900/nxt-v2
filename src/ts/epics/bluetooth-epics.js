import { isActionOf } from "typesafe-actions";
import { catchError, concatMap, filter, map, switchMap } from "rxjs/operators";
import { from, of } from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import * as bluetoothActions from '../actions/bluetooth-actions';
import * as deviceActions from "../actions/device-actions";
import { sensorConfig, writePacket } from "../actions/device-actions";
import { GetBatteryLevel } from "../nxt-structure/packets/direct/get-battery-level";
import { GetDeviceInfo } from "../nxt-structure/packets/system/get-device-info";
import { GetFirmwareVersion } from "../nxt-structure/packets/system/get-firmware-version";
import { SteeringControl } from "../utils/Files";
import { StartProgram } from "../nxt-structure/packets/direct/start-program";
import { SensorType } from "../nxt-structure/sensor/sensor-constants";
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
        sensorConfig.request({ sensorType: SensorType.ULTRASONIC_CM, port: 1 }),
        sensorConfig.request({ sensorType: SensorType.LIGHT_ACTIVE, port: 2 }),
        sensorConfig.request({ sensorType: SensorType.TOUCH, port: 3 }),
        sensorConfig.request({ sensorType: SensorType.SOUND_DBA, port: 4 }),
        deviceActions.sensorHandler.request([1, 2, 3, 4]),
    ]; }), catchError(function (err) { return of(bluetoothActions.connectToDevice.failure(err)); }));
};
export var disconnectFromDevice = function (action$) {
    return action$.pipe(filter(isActionOf(bluetoothActions.disconnectFromDevice.request)), switchMap(function () {
        return from(ReactNativeBluetoothSerial.disconnect()).pipe(map(bluetoothActions.disconnectFromDevice.success), catchError(function (err) { return of(bluetoothActions.disconnectFromDevice.failure(err)); }));
    }));
};
