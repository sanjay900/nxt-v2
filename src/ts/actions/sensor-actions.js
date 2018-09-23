import { createAction, createAsyncAction } from "typesafe-actions";
export var disableSensors = createAction("disableSensors", function (resolve) {
    return function (sensors) { return resolve(sensors); };
});
export var enableSensors = createAction("enableSensors", function (resolve) {
    return function (sensors) { return resolve(sensors); };
});
export var sensorHandler = createAsyncAction('sensorHandlerRequest', 'sensorHandlerResponse', 'sensorHandlerFailure')();
export var sensorUpdate = createAction("sensorUpdate", function (resolve) {
    return function (sensorData) { return resolve(sensorData); };
});
export var sensorConfig = createAsyncAction('sensorConfigRequest', 'sensorConfigResponse', 'sensorConfigFailure')();
