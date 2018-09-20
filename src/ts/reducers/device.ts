import {
    MultiOutputPort,
    OutputRegulationMode,
    OutputRunState,
    SingleOutputPort,
    SteeringConfig
} from "../nxt-structure/motor-constants";
import {InputSensorMode, InputSensorType, SensorType} from "../nxt-structure/sensor-constants";
import {Packet} from "../nxt-structure/packets/packet";
import {SystemCommand} from "../nxt-structure/packets/system-command";
import {getType} from "typesafe-actions";
import * as deviceActions from "../actions/device-actions";
import {GetDeviceInfo} from "../nxt-structure/packets/system/get-device-info";
import {GetFirmwareVersion} from "../nxt-structure/packets/system/get-firmware-version";
import {DirectCommand} from "../nxt-structure/packets/direct-command";
import {GetBatteryLevel} from "../nxt-structure/packets/direct/get-battery-level";
import {SetBrickName} from "../nxt-structure/packets/system/set-brick-name";
import {BluetoothAction, DeviceAction, DeviceState, SystemOutput, SystemSensor} from "../store";
import {connectToDevice} from "../actions/bluetooth-actions";
import {set} from "dot-prop-immutable";

const initialSensor: SystemSensor = {
    type: SensorType.NONE,
    systemType: InputSensorType.NO_SENSOR,
    mode: InputSensorMode.RAW,
    dataHistory: [],
    data: {
        port: 0,
        rawValue: 0,
        scaledValue: 0
    },
    enabled: false
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
        },
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
        invertSteering: false,
        invertThrottle: false,
        config: SteeringConfig.FRONT_STEERING,
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
export type PacketError = {
    error: Error,
    packet: Packet
}
export const device = (state: DeviceState = initialState, action: DeviceAction | BluetoothAction) => {
    switch (action.type) {
        case getType(connectToDevice.success):
            return {...state, info: {...state.info, programToUpload: undefined}};
        case getType(deviceActions.readPacket):
            return {...state, ...processIncomingPacket(action.payload.packet, state)};
        case getType(deviceActions.writeFileProgress):
            return {...state, info: {...state.info, currentFile: action.payload.packet.file}};
        case getType(deviceActions.writeFile.failure):
            console.error(action.payload);
            return {...state, lastMessage: action.payload.error.message};
        case getType(deviceActions.writePacket.request):
            return {...state, ...processOutgoingPacket(action.payload, state)};

        case getType(deviceActions.writePacket.success):
            return {...state};

        case getType(deviceActions.sensorConfig.failure):
            console.log("config", action.payload.error, DirectCommand[action.payload.packet.id], SystemCommand[action.payload.packet.id]);
            return {...state, lastMessage: action.payload.error.message};
        case getType(deviceActions.sensorHandler.failure):
            console.log("handler", action.payload.error, DirectCommand[action.payload.packet.id], SystemCommand[action.payload.packet.id]);
            return {...state, lastMessage: action.payload.error.message};
        case getType(deviceActions.writePacket.failure):
            console.log(action.payload);
            return {...state, lastMessage: action.payload.error.message};

        case getType(deviceActions.joystickMove):
            if (action.payload.name == "STEERING") {
                return {...state, outputConfig: {...state.outputConfig, targetAngle: action.payload.x * 41}}
            } else {
                return {...state, outputConfig: {...state.outputConfig, power: action.payload.y * 41}}
            }
        case getType(deviceActions.joystickRelease):
            if (action.payload == "STEERING") {
                return {...state, outputConfig: {...state.outputConfig, targetAngle: 0}}
            } else {
                return {...state, outputConfig: {...state.outputConfig, power: 0}}
            }
        case getType(deviceActions.writeConfig.request):
            return {...state, outputConfig: action.payload};

        case getType(deviceActions.sensorConfig.request):
            return set(state, `inputs.${action.payload.port}.type`, action.payload.sensorType);
        case getType(deviceActions.enableSensors):
            let sensors = action.payload || [1, 2, 3, 4];
            for (let sensor of sensors) {
                state = set(state, `inputs.${sensor}.enabled`, true);
            }
            return state;
        case getType(deviceActions.disableSensors):
            state = set(state, `inputs.1.enabled`, false);
            state = set(state, `inputs.2.enabled`, false);
            state = set(state, `inputs.3.enabled`, false);
            state = set(state, `inputs.4.enabled`, false);
            return state;
        case getType(deviceActions.sensorUpdate):
            console.log(action);
            return state
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

