import { createAction, createAsyncAction } from "typesafe-actions";
export var writeConfig = createAsyncAction('writeConfigRequest', 'writeConfigResponse', 'writeConfigFailure')();
export var startMotorHandler = createAsyncAction('startMotorHandlerRequest', 'startMotorHandlerResponse', 'startMotorHandlerFailure')();
export var startMotorListener = createAsyncAction('startMotorListenerRequest', 'startMotorListenerResponse', 'startMotorListenerFailure')();
export var disableMotorListener = createAction("disableMotorListener", function (resolve) {
    return function (motors) { return resolve(motors); };
});
export var enableMotorListener = createAction("enableMotorListener", function (resolve) {
    return function (motors) { return resolve(motors); };
});
export var motorUpdate = createAction("motorUpdate", function (resolve) {
    return function (data) { return resolve(data); };
});
