import { isActionOf } from "typesafe-actions";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { from, of } from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import { Buffer } from "buffer";
import * as deviceActions from '../actions/device-actions';
import { SetBrickName } from "../nxt-structure/packets/system/set-brick-name";
export var sendPacket = function (action$) {
    return action$.pipe(filter(isActionOf(deviceActions.writePacket.request)), switchMap(function (action) { return from(ReactNativeBluetoothSerial.write(Buffer.from(action.payload.writePacket(true)))).pipe(map(deviceActions.writePacket.success), catchError(function (err) { return of(deviceActions.writePacket.failure(err)); })); }));
};
export var setName = function (action$) {
    return action$.pipe(filter(isActionOf(deviceActions.setName)), map(function (action) { return deviceActions.writePacket.request(SetBrickName.createPacket(action.payload)); }));
};
