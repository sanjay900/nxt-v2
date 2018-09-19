import {createAction, createAsyncAction} from "typesafe-actions";
import {Packet} from "../nxt-structure/packets/packet";
import {DirectCommand} from "../nxt-structure/packets/direct-command";
import {SystemCommand} from "../nxt-structure/packets/system-command";
import {NXTFile} from "../nxt-structure/nxt-file";
import {Write} from "../nxt-structure/packets/system/write";
import {Joystick, OutputConfig, PacketError} from "../reducers/device";
import {SensorData} from "../nxt-structure/sensor/sensor";


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
)<void, void, PacketError>();
export const sensorHandlerProgress = createAction("sensorHandlerProgress", resolve => {
    return (sensorData: SensorData) => resolve(sensorData);
});
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
)<NXTFile, void, PacketError>();

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