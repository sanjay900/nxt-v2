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
import * as bluetoothActions from '../actions/bluetooth-actions';
import { getType } from "typesafe-actions";
export var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["CONNECTING"] = 0] = "CONNECTING";
    ConnectionStatus[ConnectionStatus["CONNECTED"] = 1] = "CONNECTED";
    ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 2] = "DISCONNECTED";
})(ConnectionStatus || (ConnectionStatus = {}));
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
        case getType(bluetoothActions.disconnectFromDevice.failure):
            return __assign({}, state, { status: ConnectionStatus.DISCONNECTED, lastMessage: action.payload.message });
        case getType(bluetoothActions.disconnectFromDevice.success):
            return __assign({}, state, { status: ConnectionStatus.DISCONNECTED, lastMessage: "Disconnected" });
        case getType(bluetoothActions.disconnect):
            if (state.status != ConnectionStatus.DISCONNECTED) {
                return __assign({}, state, { status: ConnectionStatus.DISCONNECTED, lastMessage: "Connection lost" });
            }
            return state;
    }
    return state;
};
