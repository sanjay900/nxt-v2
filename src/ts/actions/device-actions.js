import { createAction, createAsyncAction } from "typesafe-actions";
export var readPacket = createAction("readPacket", function (resolve) {
    return function (packet, type) { return resolve({ packet: packet, type: type }); };
});
export var writePacket = createAsyncAction('writePacketRequest', 'writePacketResponse', 'writePacketFailure')();
export var writeFile = createAsyncAction('writeFileRequest', 'writeFileResponse', 'writeFileFailure')();
export var writeFileProgress = createAction("writeFileProgress", function (resolve) {
    return function (packet) { return resolve({ packet: packet }); };
});
export var joystickMove = createAction("joystickMove", function (resolve) {
    return function (event) { return resolve(event); };
});
export var joystickRelease = createAction("joystickTouch", function (resolve) {
    return function (joystick) { return resolve(joystick); };
});
export var joystickTouch = createAction("joystickRelease", function (resolve) {
    return function (joystick) { return resolve(joystick); };
});
export var startInfoListener = createAsyncAction('startInfoListenerRequest', 'startInfoListenerResponse', 'startInfoListenerFailure')();
