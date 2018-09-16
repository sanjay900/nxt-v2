import {
    MultiOutputPort,
    OutputPort,
    OutputRegulationMode,
    OutputRunState,
    SingleOutputPort,
    SteeringConfig
} from "../nxt-structure/motor/motor-constants";
import {InputSensorMode, InputSensorType, SensorData, SensorType} from "../nxt-structure/sensor/sensor";
import {Packet} from "../nxt-structure/packets/packet";
import {SystemCommand} from "../nxt-structure/packets/system-command";
import {ActionType, getType} from "typesafe-actions";
import * as deviceActions from "../actions/device-actions";
import {GetDeviceInfo} from "../nxt-structure/packets/system/get-device-info";
import {GetFirmwareVersion} from "../nxt-structure/packets/system/get-firmware-version";
import {DirectCommand} from "../nxt-structure/packets/direct-command";
import {GetBatteryLevel} from "../nxt-structure/packets/direct/get-battery-level";
import {SetBrickName} from "../nxt-structure/packets/system/set-brick-name";

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
        }
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
        4: SystemSensor
    }
    outputConfig: {
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
}
const initialSensor: SystemSensor = {
    type: SensorType.NONE,
    systemType: InputSensorType.NO_SENSOR,
    mode: InputSensorMode.RAW,
    dataHistory: [],
    data: {
        rawValue: 0,
        scaledValue: 0
    }
};
const initialOutput: SystemOutput = {
    mode: 0,
    regulationMode: OutputRegulationMode.IDLE,
    runState: OutputRunState.IDLE,
    data: {
        blockTachoCount: 0,
        power: 0,
        rotationCount: 0,
        tachoCount: 0,
        turnRatio: 0,
        tachoLimit: 0
    },
    dataHistory: []
};
const initialState: DeviceState = {
    info: {
        currentProgramName: "None",
        deviceName: "NXT",
        btAddress: "00:00:00:00:00:00",
        btSignalStrength: 0,
        freeSpace: 0,
        batteryVoltage: 0,
        version: {
            protocol: "0.0",
            firmware: "0.0"
        }
    }, outputs: {
        A: {...initialOutput},
        B: {...initialOutput},
        C: {...initialOutput}
    }, inputs: {
        1: {...initialSensor},
        2: {...initialSensor},
        3: {...initialSensor},
        4: {...initialSensor}
    }, outputConfig: {
        config: SteeringConfig.FRONT_STEERING,
        invertSteering: false,
        invertThrottle: false,
        power: 0,
        targetAngle: 0,
        frontOutputs: {
            drivePort: MultiOutputPort.B_C,
            steeringPort: SingleOutputPort.A
        }, tankOutputs: {
            leftPort: SingleOutputPort.A,
            rightPort: SingleOutputPort.C
        },
    },
};
export const device = (state: DeviceState = initialState, action: DeviceAction) => {
    switch (action.type) {
        case getType(deviceActions.readPacket):
            return {...state, ...processIncomingPacket(action.payload.packet, state)};

        case getType(deviceActions.writeFile.failure):
            return {...state, lastMessage: action.payload.message};

        case getType(deviceActions.writePacket.request):
            return {...state, ...processOutgoingPacket(action.payload, state)};

        case getType(deviceActions.writePacket.success):
            return {...state};

        case getType(deviceActions.writePacket.failure):
            return {...state, lastMessage: action.payload.message};
    }
    return state;
};

function processOutgoingPacket(packet: Packet, state: DeviceState): any {
    switch (packet.id) {
        case SystemCommand.SET_BRICK_NAME:
            let {name: deviceName} = packet as SetBrickName;
            return {
                info: {...state.info, deviceName}
            };
    }
    return {};
}

function processIncomingPacket(packet: Packet, state: DeviceState): any {
    switch (packet.id) {
        case SystemCommand.GET_DEVICE_INFO:
            let {name: deviceName, btAddress, btSignalStrength, freeSpace} = packet as GetDeviceInfo;
            return {
                info: {...state.info, deviceName, btSignalStrength, btAddress, freeSpace}
            };

        case SystemCommand.GET_FIRMWARE_VERSION:
            let {firmwareVersion: firmware, protocolVersion: protocol} = packet as GetFirmwareVersion;
            return {
                info: {
                    ...state.info,
                    version: {firmware, protocol}
                }
            };

        case DirectCommand.GET_BATTERY_LEVEL:
            let {voltage} = packet as GetBatteryLevel;
            return {
                info: {
                    ...state.info,
                    batteryVoltage: voltage
                }
            };
    }
    return {};
}