import {ActionsObservable, Epic} from "redux-observable";
import {isActionOf} from "typesafe-actions";
import {RootAction, RootState} from "../store";
import {catchError, concatMap, filter, map, switchMap} from "rxjs/operators";
import {from, of} from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";

import * as bluetoothActions from '../actions/bluetooth-actions';
import * as deviceActions from "../actions/device-actions";
import * as sensorActions from "../actions/sensor-actions";
import * as motorActions from "../actions/motor-actions";
import {writePacket} from "../actions/device-actions";
import {GetBatteryLevel} from "../nxt-structure/packets/direct/get-battery-level";
import {GetDeviceInfo} from "../nxt-structure/packets/system/get-device-info";
import {GetFirmwareVersion} from "../nxt-structure/packets/system/get-firmware-version";
import {SteeringControl} from "../utils/Files";
import {StartProgram} from "../nxt-structure/packets/direct/start-program";


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

export const connectToDevice = (action$: ActionsObservable<RootAction>) =>
    action$.pipe(
        filter(isActionOf(bluetoothActions.connectToDevice.request)),
        switchMap(action => from(ReactNativeBluetoothSerial.connect(action.payload.id))),
        concatMap(() => [
                bluetoothActions.connectToDevice.success(),
                writePacket.request(GetBatteryLevel.createPacket()),
                writePacket.request(GetDeviceInfo.createPacket()),
                writePacket.request(GetFirmwareVersion.createPacket()),
                writePacket.request(StartProgram.createPacket(SteeringControl)),
                sensorActions.sensorHandler.request(),
                motorActions.startMotorListener.request(),
                deviceActions.startInfoListener.request()
            ]
        ),
        catchError(err => of(bluetoothActions.connectToDevice.failure(err)))
    )
;
export const disconnectFromDevice: Epic<RootAction, RootAction, RootState> = (action$) =>
    action$.pipe(
        filter(isActionOf(bluetoothActions.disconnectFromDevice.request)),
        switchMap(() =>
            from(ReactNativeBluetoothSerial.disconnect()).pipe(
                map(bluetoothActions.disconnectFromDevice.success),
                catchError(err => of(bluetoothActions.disconnectFromDevice.failure(err)))
            )
        )
    );
