// @flow
import BluetoothSerial from 'react-native-bluetooth-serial';
import { Buffer } from 'buffer';
import type { Dispatch, ThunkAction, Device } from './types';

export function requestDevices(): ThunkAction {
    return function (dispatch) {
        return BluetoothSerial.list().then(list => {
            dispatch({
                type: "LIST_DEVICES",
                list: list
            });
        });
    };
}

export function connectToDevice(device: Device): ThunkAction {
    return (dispatch: Dispatch) => {
        dispatch({type: "SET_DEVICE", device: device});
        return BluetoothSerial.connect(device.id).then(message => {
            dispatch({
                type: "CHANGE_STATUS",
                connectionStatus: "CONNECTED",
                message: message
            });
        }).catch(error => {
            dispatch({
                type: "CHANGE_STATUS",
                connectionStatus: "DISCONNECTED",
                message: error
            });
        });
    };
}