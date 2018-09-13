import {BluetoothState, ConnectionStatus} from "../actions/types";
import * as bluetoothActions from '../actions/bluetooth-actions';
import {ActionType, getType} from "typesafe-actions";

export type BluetoothAction = ActionType<typeof bluetoothActions>;

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
        case getType(bluetoothActions.readPacket):
            console.error(action.payload);
            return {...state};
        case getType(bluetoothActions.writePacket.failure):
            return {...state, lastMessage: action.payload.message};
    }
    return state;
};