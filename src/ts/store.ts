import {BluetoothAction, BluetoothState} from "./reducers/bluetooth";
import {CoreAction, CoreState} from "./reducers/core";
import {DeviceAction, DeviceState} from "./reducers/device";

export type State = {
    bluetooth: BluetoothState,
    core: CoreState,
    device: DeviceState
};


export type RootAction = BluetoothAction | CoreAction | DeviceAction;
export type RootState = { core: CoreState, bluetooth: BluetoothState, device: DeviceState }