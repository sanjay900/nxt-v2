var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { ConnectionStatus } from "../actions/types";
import * as bluetoothActions from '../actions/bluetooth-actions';
import { getType } from "typesafe-actions";
var initialState = {
    list: [],
    status: ConnectionStatus.DISCONNECTED
};
export var bluetooth = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case getType(bluetoothActions.listDevices.success):
            return __assign({}, state, { list: action.payload });
        case getType(bluetoothActions.setDevice):
            return __assign({}, state, { device: action.payload });
        case getType(bluetoothActions.changeStatus):
            return __assign({}, state, { status: action.payload.status, lastMessage: action.payload.message });
        case getType(bluetoothActions.connectToDevice.request):
            return __assign({}, state, { status: ConnectionStatus.CONNECTING, lastMessage: "", device: action.payload });
        case getType(bluetoothActions.connectToDevice.success):
            return __assign({}, state, { status: ConnectionStatus.CONNECTED, lastMessage: "Connected to the NXT device" });
        case getType(bluetoothActions.connectToDevice.failure):
            return __assign({}, state, { status: ConnectionStatus.DISCONNECTED, lastMessage: action.payload.message });
        case getType(bluetoothActions.disconnect):
            return __assign({}, state, { status: ConnectionStatus.DISCONNECTED, lastMessage: "Connection lost" });
        case getType(bluetoothActions.readPacket):
            console.error(action.payload);
            return __assign({}, state);
        case getType(bluetoothActions.writePacket.failure):
            return __assign({}, state, { lastMessage: action.payload.message });
    }
    return state;
};
