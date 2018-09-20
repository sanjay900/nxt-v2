import {Device} from "react-native-bluetooth-serial";
import {ActionType} from "typesafe-actions";
import * as coreActions from "./actions/core-actions";
import * as bluetoothActions from "./actions/bluetooth-actions";
import {
    OutputPort,
    OutputRegulationMode,
    OutputRunState,
    SingleOutputPort,
    SteeringConfig
} from "./nxt-structure/motor-constants";
import * as deviceActions from "./actions/device-actions";
import {InputSensorMode, InputSensorType, SensorData, SensorType} from "./nxt-structure/sensor-constants";
import {NXTFile} from "./nxt-structure/nxt-file";

export type CoreAction = ActionType<typeof coreActions>;
export enum ConnectionStatus { CONNECTING, CONNECTED, DISCONNECTED }

export type BluetoothState = {
    device?: Device,
    list: Device[],
    status: ConnectionStatus,
    lastMessage?: string
}

export type Joystick = {
    x: number,
    y: number,
    tapped: boolean,
    name: string
}

export enum Mode { JOYSTICK, TILT }

export type CoreState = {
    mode: Mode
}
export type DeviceAction = ActionType<typeof deviceActions>;
export type SystemOutput = {
    mode: number,
    regulationMode: OutputRegulationMode,
    runState: OutputRunState,
    data: OutputData
    dataHistory: OutputData[]
}
export type OutputData = {
    turnRatio: number,
    tachoLimit: number,
    tachoCount: number,
    blockTachoCount: number,
    rotationCount: number,
    power: number
}
export type SystemSensor = {
    type: SensorType,
    systemType: InputSensorType,
    mode: InputSensorMode,
    data: SensorData
    dataHistory: SensorData[],
}
export type OutputConfig = {
    targetAngle: number,
    power: number,
    config: SteeringConfig,
    invertSteering: false,
    invertThrottle: false,
    tankOutputs: {
        leftPort: SingleOutputPort,
        rightPort: SingleOutputPort,
    }, frontOutputs: {
        drivePort: OutputPort,
        steeringPort: SingleOutputPort
    }
}
export type DeviceState = {
    info: {
        currentProgramName: string,
        deviceName: string,
        btAddress: string,
        btSignalStrength: number,
        freeSpace: number,
        batteryVoltage: number,
        version: {
            protocol: string,
            firmware: string
        },
        currentFile?: NXTFile
    },
    outputs: {
        A: SystemOutput,
        B: SystemOutput,
        C: SystemOutput
    },
    inputs: {
        1: SystemSensor,
        2: SystemSensor,
        3: SystemSensor,
        4: SystemSensor,
        [key: number]: SystemSensor
    }
    outputConfig: OutputConfig
}
export type State = {
    bluetooth: BluetoothState,
    core: CoreState,
    device: DeviceState
};


export type BluetoothAction = ActionType<typeof bluetoothActions>;
export type RootAction = BluetoothAction | CoreAction | DeviceAction;
export type RootState = { core: CoreState, bluetooth: BluetoothState, device: DeviceState }