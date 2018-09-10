//@ flow
import type { Action, BluetoothState } from "../actions/types";
const initialState = {
    list: [],
    status: "DISCONNECTED"
};

import Toast from '@remobile/react-native-toast';
export function bluetooth(state: BluetoothState = initialState, action: Action) {
    switch (action.type) {
        case "LIST_DEVICES":
            return Object.assign({}, state, {
                list: action.list
            });
        case "SET_DEVICE":
            return Object.assign({}, state, {
                device: action.device,
                status: "CONNECTING"
            });
        case "CHANGE_STATUS":
            Toast.showShortBottom(`Message from bluetooth device: ${action.message}`);
            return Object.assign({}, state, {
                status: action.connectionStatus,
                lastMessage: action.message
            });
    }
    return state;
}