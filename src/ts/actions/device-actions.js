import {createAction, createAsyncAction} from "typesafe-actions";

export var disableSensors = createAction("disableSensors");
export var enableSensors = createAction("enableSensors", function (resolve) {
    return function (sensors) {
        return resolve(sensors);
    };
});
export var readPacket = createAction("readPacket", function (resolve) {
    return function (packet, type) {
        return resolve({packet: packet, type: type});
    };
});
export var writeConfig = createAsyncAction('writeConfigRequest', 'writeConfigResponse', 'writeConfigFailure')();
export var sensorHandler = createAsyncAction('sensorHandlerRequest', 'sensorHandlerResponse', 'sensorHandlerFailure')();
export var sensorUpdate = createAction("sensorUpdate", function (resolve) {
    return function (sensorData) {
        return resolve(sensorData);
    };
});
export var sensorConfig = createAsyncAction('sensorConfigRequest', 'sensorConfigResponse', 'sensorConfigFailure')();
export var startMotorHandler = createAsyncAction('startMotorHandlerRequest', 'startMotorHandlerResponse', 'startMotorHandlertFailure')();
export var writePacket = createAsyncAction('writePacketRequest', 'writePacketResponse', 'writePacketFailure')();
export var writeFile = createAsyncAction('writeFileRequest', 'writeFileResponse', 'writeFileFailure')();
export var writeFileProgress = createAction("writeFileProgress", function (resolve) {
    return function (packet) {
        return resolve({packet: packet});
    };
});
export var joystickMove = createAction("joystickMove", function (resolve) {
    return function (event) {
        return resolve(event);
    };
});
export var joystickRelease = createAction("joystickTouch", function (resolve) {
    return function (joystick) {
        return resolve(joystick);
    };
});
export var joystickTouch = createAction("joystickRelease", function (resolve) {
    return function (joystick) {
        return resolve(joystick);
    };
});
