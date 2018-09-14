import {ConnectionStatus} from '../reducers/bluetooth';
import {createAction, createAsyncAction} from "typesafe-actions";
import {Device} from "react-native-bluetooth-serial";

export const setDevice = createAction("setDevice", resolve => {
    return (device: Device) => resolve(device);
});
export const changeStatus = createAction("changeStatus", resolve => {
    return (status: ConnectionStatus, message?: string) => resolve({status, message});
});

export const disconnect = createAction("disconnect");

export const disconnectFromDevice = createAsyncAction(
    'disconnectRequest',
    'disconnectResponse',
    'disconnectFailure'
)<void, void, Error>();

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
