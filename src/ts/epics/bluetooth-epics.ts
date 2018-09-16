import {Epic} from "redux-observable";
import {isActionOf} from "typesafe-actions";
import {RootAction, RootState} from "../store";
import {catchError, filter, map, mergeMap, switchMap} from "rxjs/operators";
import {from, of} from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";

import * as bluetoothActions from '../actions/bluetooth-actions';
import {writeFile, writePacket} from "../actions/device-actions";
import {GetBatteryLevel} from "../nxt-structure/packets/direct/get-battery-level";
import {GetDeviceInfo} from "../nxt-structure/packets/system/get-device-info";
import {GetFirmwareVersion} from "../nxt-structure/packets/system/get-firmware-version";
import {NXTFile} from "../nxt-structure/nxt-file";
import SteeringControl from "../../../SteeringControl.rxe";


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
                mergeMap(() => [
                        bluetoothActions.connectToDevice.success(),
                        writePacket.request(GetBatteryLevel.createPacket()),
                        writePacket.request(GetDeviceInfo.createPacket()),
                        writePacket.request(GetFirmwareVersion.createPacket()),
                        writeFile.request(new NXTFile("SteeringControl.rxe", SteeringControl))
                    ]
                ),
                catchError(err => of(bluetoothActions.connectToDevice.failure(err)))
            )
        )
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
