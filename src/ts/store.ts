import {BluetoothAction, BluetoothState} from "./reducers/bluetooth";
import {CoreAction, CoreState} from "./reducers/core";
import {JoystickAction, JoystickState} from "./reducers/joystick";
import {DeviceAction, DeviceState} from "./reducers/device";

export type State = {
    bluetooth: BluetoothState,
    joystick: JoystickState,
    core: CoreState,
    device: DeviceState
};


export type RootAction = BluetoothAction | CoreAction | JoystickAction | DeviceAction;
export type RootState = { core: CoreState, bluetooth: BluetoothState, joystick: JoystickState, device: DeviceState }