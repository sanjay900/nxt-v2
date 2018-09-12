// @flow
import {BluetoothAction} from "../reducers/bluetooth";
import {Device} from "react-native-bluetooth-serial";
import {CoreAction} from "../reducers";
import {JoystickAction} from "../reducers/joystick";
import {StateType} from "typesafe-actions";

export enum ConnectionStatus { CONNECTING, CONNECTED, DISCONNECTED }

export enum Mode { JOYSTICK, TILT }

export type BluetoothState = {
    device?: Device,
    list: Device[],
    status: ConnectionStatus,
    lastMessage?: string
}
export type JoystickState = {
    steering: Joystick,
    drive: Joystick
}
export type CoreState = {
    mode: Mode
}
export type State = {
    bluetooth: BluetoothState,
    joystick: JoystickState,
    core: CoreState
};


export type Joystick = {
    x: number,
    y: number,
    tapped: boolean,
    name: string
}

export type RootAction = BluetoothAction | CoreAction | JoystickAction;
export type RootState = StateType<{ core: CoreState, bluetooth: BluetoothState, joystick: JoystickState }>