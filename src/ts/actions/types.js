export var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["CONNECTING"] = 0] = "CONNECTING";
    ConnectionStatus[ConnectionStatus["CONNECTED"] = 1] = "CONNECTED";
    ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 2] = "DISCONNECTED";
})(ConnectionStatus || (ConnectionStatus = {}));
export var Mode;
(function (Mode) {
    Mode[Mode["JOYSTICK"] = 0] = "JOYSTICK";
    Mode[Mode["TILT"] = 1] = "TILT";
})(Mode || (Mode = {}));
