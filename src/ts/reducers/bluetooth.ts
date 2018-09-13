import * as bluetoothActions from '../actions/bluetooth-actions';
import {ActionType, getType} from "typesafe-actions";
import {Device} from "react-native-bluetooth-serial";

export type BluetoothAction = ActionType<typeof bluetoothActions>;

export enum ConnectionStatus { CONNECTING, CONNECTED, DISCONNECTED }

export type BluetoothState = {
    device?: Device,
    list: Device[],
    status: ConnectionStatus,
    lastMessage?: string
}
const initialState: BluetoothState = {
    list: [],
    status: ConnectionStatus.DISCONNECTED
};

export const bluetooth = (state: BluetoothState = initialState, action: BluetoothAction) => {
    switch (action.type) {
        case getType(bluetoothActions.listDevices.success):
            return {...state, list: action.payload};
        case getType(bluetoothActions.setDevice):
            return {...state, device: action.payload};
        case getType(bluetoothActions.changeStatus):
            return {...state, status: action.payload.status, lastMessage: action.payload.message};
        case getType(bluetoothActions.connectToDevice.request):
            return {...state, status: ConnectionStatus.CONNECTING, lastMessage: "", device: action.payload};
        case getType(bluetoothActions.connectToDevice.success):
            return {...state, status: ConnectionStatus.CONNECTED, lastMessage: "Connected to the NXT device"};
        case getType(bluetoothActions.connectToDevice.failure):
            return {...state, status: ConnectionStatus.DISCONNECTED, lastMessage: action.payload.message};
        case getType(bluetoothActions.disconnect):
            return {...state, status: ConnectionStatus.DISCONNECTED, lastMessage: "Connection lost"};
    }
    return state;
};
