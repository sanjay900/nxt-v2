import {Epic} from "redux-observable";
import {isActionOf} from "typesafe-actions";
import {RootAction, RootState} from "../store";
import {catchError, filter, map, switchMap, tap} from "rxjs/operators";
import {from, of} from "rxjs";
import ReactNativeBluetoothSerial from "react-native-bluetooth-serial";
import {Buffer} from "buffer";

import * as deviceActions from '../actions/device-actions';
import {SetBrickName} from "../nxt-structure/packets/system/set-brick-name";

export const sendPacket: Epic<RootAction, RootAction, RootState> = (action$) =>
    action$.pipe(
        filter(isActionOf(deviceActions.writePacket.request)),
        switchMap(action => from(ReactNativeBluetoothSerial.write(Buffer.from(action.payload.writePacket(true)))).pipe(
            map(deviceActions.writePacket.success),
            catchError(err => of(deviceActions.writePacket.failure(err)))
            )
        )
    );

export const setName: Epic<RootAction, RootAction, RootState> = (action$) =>
    action$.pipe(
        filter(isActionOf(deviceActions.setName)),
        map(action => deviceActions.writePacket.request(SetBrickName.createPacket(action.payload)))
    );