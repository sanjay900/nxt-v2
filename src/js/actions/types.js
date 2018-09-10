// @flow
export type ConnectionStatus = "CONNECTING" | "CONNECTED" | "DISCONNECTED";
export type Device = { id: string, name: string };
export type Mode = "JOYSTICK" | "TILT";
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
export type Action =
    { type: "TOGGLE_MODE" }
    | { type: "SET_DEVICE", device: Device }
    | { type: "CHANGE_STATUS", status: ConnectionStatus, message: string }
    | { type: "LIST_DEVICES", list: Device[] }
    | { type: "JOYSTICK_MOVE", event: Joystick }
    | { type: "JOYSTICK_RELEASE", joystick: string }
    | { type: "JOYSTICK_TOUCH", joystick: string };

export type GetState = () => State;
export type PromiseAction = Promise<Action>;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;