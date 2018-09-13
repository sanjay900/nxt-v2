import {ConnectionStatus} from './types';
import {createAction, createAsyncAction} from "typesafe-actions";
import {Device} from "react-native-bluetooth-serial";
import {Packet} from "../nxt/packets/packet";
import {DirectCommand} from "../nxt/packets/direct-command";
import {SystemCommand} from "../nxt/packets/system-command";

export const setDevice = createAction("setDevice", resolve => {
    return (device: Device) => resolve(device);
});
export const changeStatus = createAction("changeStatus", resolve => {
    return (status: ConnectionStatus, message?: string) => resolve({status, message});
});

export const disconnect = createAction("disconnect");

export const readPacket = createAction("readPacket", resolve => {
   return (packet: Packet, type: DirectCommand | SystemCommand) => resolve({packet, type});
});

export const writePacket = createAsyncAction(
    'writePacketRequest',
    'writePacketResponse',
    'writePacketFailure'
)<Packet, void, Error>();

export const connectToDevice = createAsyncAction(
    'connectToDeviceRequest',
    'connectToDeviceResponse',
    'connectToDeviceFailure'
)<Device, void, Error>();

export const listDevices = createAsyncAction(
    'listDevicesRequest',
    'listDevicesResponse',
    'listDevicesFailure'
)<void, Device[], Error>();
