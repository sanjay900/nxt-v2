import {createAction, createAsyncAction} from "typesafe-actions";
import {Packet} from "../nxt-structure/packets/packet";
import {DirectCommand} from "../nxt-structure/packets/direct-command";
import {SystemCommand} from "../nxt-structure/packets/system-command";
import {NXTFile} from "../nxt-structure/nxt-file";
import {Write} from "../nxt-structure/packets/system/write";
import {PacketError} from "../reducers/device";
import {SensorData, SensorType} from "../nxt-structure/sensor-constants";
import {Joystick, OutputConfig, SystemSensor} from "../store";

export const disableSensors = createAction("disableSensors", resolve => {
    return (sensors?: number[]) => resolve(sensors);
});
export const enableSensors = createAction("enableSensors", resolve => {
    return (sensors?: number[]) => resolve(sensors);
});
export const readPacket = createAction("readPacket", resolve => {
    return (packet: Packet, type: DirectCommand | SystemCommand) => resolve({packet, type});
});

export const writeConfig = createAsyncAction(
    'writeConfigRequest',
    'writeConfigResponse',
    'writeConfigFailure'
)<OutputConfig, void, PacketError>();
export const sensorHandler = createAsyncAction(
    'sensorHandlerRequest',
    'sensorHandlerResponse',
    'sensorHandlerFailure'
)<number[], void, PacketError>();
export const sensorUpdate = createAction("sensorUpdate", resolve => {
    return (sensorData: SensorData) => resolve(sensorData);
});
export const sensorConfig = createAsyncAction(
    'sensorConfigRequest',
    'sensorConfigResponse',
    'sensorConfigFailure'
)<{ port: number, sensorType: SensorType }, { port: number, sensorType: SystemSensor }, PacketError>();

export const startMotorHandler = createAsyncAction(
    'startMotorHandlerRequest',
    'startMotorHandlerResponse',
    'startMotorHandlertFailure'
)<void, void, PacketError>();

export const writePacket = createAsyncAction(
    'writePacketRequest',
    'writePacketResponse',
    'writePacketFailure'
)<Packet, Packet, PacketError>();

export const writeFile = createAsyncAction(
    'writeFileRequest',
    'writeFileResponse',
    'writeFileFailure'
)<NXTFile, NXTFile, PacketError>();

export const writeFileProgress = createAction("writeFileProgress", resolve => {
    return (packet: Write) => resolve({packet});
});
export const joystickMove = createAction("joystickMove", resolve => {
    return (event: Joystick) => resolve(event);
});
export const joystickRelease = createAction("joystickTouch", resolve => {
    return (joystick: string) => resolve(joystick);
});
export const joystickTouch = createAction("joystickRelease", resolve => {
    return (joystick: string) => resolve(joystick);
});