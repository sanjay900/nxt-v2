var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) {
        e = {error: error};
    }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally {
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import {combineEpics} from "redux-observable";
import * as bluetooth from './bluetooth-epics';
import * as device from "./device-epics";
import * as sensor from "./sensor-epics";
import * as motor from "./motor-epics";

export var epics = combineEpics.apply(void 0, __spread(Object.values(bluetooth), [
    device.sendPacket,
    device.startHandlers,
    device.writeFile,
    sensor.sensorConfig,
    sensor.sensorHandler,
    motor.writeConfig,
    motor.motorHandler
]));
