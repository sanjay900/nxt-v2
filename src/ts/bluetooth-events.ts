//TODO: handle bluetooth events and converting them to actions
import BluetoothSerial from "react-native-bluetooth-serial";
import {Store} from "redux";
import {disconnect} from "./actions/bluetooth-actions";

export function initEvents(store: Store) {
    BluetoothSerial.on('bluetoothEnabled', () => {

    });
    BluetoothSerial.on('bluetoothDisabled', () => {

    });
    BluetoothSerial.on('connectionLost', () => {
        store.dispatch(disconnect());
    });
}