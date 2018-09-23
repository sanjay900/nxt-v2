import {combineEpics} from "redux-observable";
import * as bluetooth from './bluetooth-epics';
import * as device from "./device-epics";
import * as sensor from "./sensor-epics";
import * as motor from "./motor-epics";

export const epics = combineEpics(...[
    ...Object.values(bluetooth),
    device.sendPacket,
    device.writeFile,
    device.pollInfo,
    sensor.sensorConfig,
    sensor.sensorHandler,
    motor.writeConfig,
    motor.motorHandler,
    motor.motorListener,
    motor.startHandlers,
]);