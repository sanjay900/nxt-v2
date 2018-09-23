import {createAction, createAsyncAction} from "typesafe-actions";
import {Packet} from "../nxt-structure/packets/packet";
import {DirectCommand} from "../nxt-structure/packets/direct-command";
import {SystemCommand} from "../nxt-structure/packets/system-command";
import {NXTFile} from "../nxt-structure/nxt-file";
import {Write} from "../nxt-structure/packets/system/write";
import {PacketError} from "../reducers/device";
import {SensorData, SensorType} from "../nxt-structure/sensor-constants";
import {Joystick, OutputConfig, OutputData, SystemSensor} from "../store";
import {SystemOutputPort} from "../nxt-structure/motor-constants";

export const disableSensors = createAction("disableSensors", resolve => {
    return (sensors?: number[]) => resolve(sensors);
});
export const enableSensors = createAction("enableSensors", resolve => {
    return (sensors?: number[]) => resolve(sensors);
});

export const sensorHandler = createAsyncAction(
    'sensorHandlerRequest',
    'sensorHandlerResponse',
    'sensorHandlerFailure'
)<void, void, PacketError>();
export const sensorUpdate = createAction("sensorUpdate", resolve => {
    return (sensorData: SensorData) => resolve(sensorData);
});
export const sensorConfig = createAsyncAction(
    'sensorConfigRequest',
    'sensorConfigResponse',
    'sensorConfigFailure'
)<{ port: number, sensorType: SensorType }, { port: number, sensorType: SystemSensor }, PacketError>();