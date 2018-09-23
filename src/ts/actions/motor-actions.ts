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

export const writeConfig = createAsyncAction(
    'writeConfigRequest',
    'writeConfigResponse',
    'writeConfigFailure'
)<OutputConfig, void, PacketError>();


export const startMotorHandler = createAsyncAction(
    'startMotorHandlerRequest',
    'startMotorHandlerResponse',
    'startMotorHandlerFailure'
)<void, void, PacketError>();

export const startMotorListener = createAsyncAction(
    'startMotorListenerRequest',
    'startMotorListenerResponse',
    'startMotorListenerFailure'
)<void, void, PacketError>();

export const disableMotorListener = createAction("disableMotorListener", resolve => {
    return (motors?: SystemOutputPort[]) => resolve(motors);
});
export const enableMotorListener = createAction("enableMotorListener", resolve => {
    return (motors?: SystemOutputPort[]) => resolve(motors);
});

export const motorUpdate = createAction("motorUpdate", resolve => {
    return (data: OutputData) => resolve(data);
});