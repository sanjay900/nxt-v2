//TODO: handle bluetooth events and converting them to actions
import BluetoothSerial from "react-native-bluetooth-serial";
import {disconnect} from "./actions/bluetooth-actions";

export function initEvents(store) {
    BluetoothSerial.on('bluetoothEnabled', function () {
    });
    BluetoothSerial.on('bluetoothDisabled', function () {
    });
    BluetoothSerial.on('connectionLost', function () {
        store.dispatch(disconnect());
    });
}
