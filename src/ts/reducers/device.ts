import {
    MultiOutputPort,
    OutputRegulationMode,
    OutputRunState,
    SingleOutputPort,
    SteeringConfig,
    SystemOutputPort
} from "../nxt-structure/motor-constants";
import {InputSensorMode, InputSensorType, SensorType} from "../nxt-structure/sensor-constants";
import {Packet} from "../nxt-structure/packets/packet";
import {SystemCommand} from "../nxt-structure/packets/system-command";
import {getType} from "typesafe-actions";
import * as deviceActions from "../actions/device-actions";
import * as motorActions from "../actions/motor-actions";
import * as sensorActions from "../actions/sensor-actions";
import {GetDeviceInfo} from "../nxt-structure/packets/system/get-device-info";
import {GetFirmwareVersion} from "../nxt-structure/packets/system/get-firmware-version";
import {DirectCommand} from "../nxt-structure/packets/direct-command";
import {GetBatteryLevel} from "../nxt-structure/packets/direct/get-battery-level";
import {SetBrickName} from "../nxt-structure/packets/system/set-brick-name";
import {DeviceState, RootAction, SystemOutput, SystemSensor} from "../store";
import {connectToDevice} from "../actions/bluetooth-actions";
import {get, set} from "dot-prop-immutable";
import * as coreActions from "../actions/core-actions";

const initialSensor: (port: number) => SystemSensor = (port: number) => ({
    type: SensorType.NONE,
    systemType: InputSensorType.NO_SENSOR,
    mode: InputSensorMode.RAW,
    dataHistory: [],
    data: {
        port: port,
        rawValue: 0,
        scaledValue: 0
    },
    enabled: false
});
export const initialOutput: (port: SystemOutputPort) => SystemOutput = (port: SystemOutputPort) => ({
    mode: 0,
    regulationMode: OutputRegulationMode.IDLE,
    runState: OutputRunState.IDLE,
    data: {
        blockTachoCount: 0,
        power: 0,
        rotationCount: 0,
        tachoCount: 0,
        turnRatio: 0,
        tachoLimit: 0,
        port
    },
    dataHistory: [],
    listening: false
});
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
        A: {...initialOutput(SystemOutputPort.A)},
        B: {...initialOutput(SystemOutputPort.B)},
        C: {...initialOutput(SystemOutputPort.C)}
    }, inputs: {
        1: {...initialSensor(1)},
        2: {...initialSensor(2)},
        3: {...initialSensor(3)},
        4: {...initialSensor(4)}
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
export const device = (state: DeviceState = initialState, action: RootAction) => {
    switch (action.type) {
        case getType(connectToDevice.success):
            return {...state, info: {...state.info, programToUpload: undefined}};
        case getType(deviceActions.readPacket):
            return {...state, ...processIncomingPacket(action.payload.packet, state)};
        case getType(deviceActions.writeFileProgress):
            return {...state, info: {...state.info, currentFile: action.payload.packet.file}};
        case getType(deviceActions.writePacket.request):
            return {...state, ...processOutgoingPacket(action.payload, state)};

        case getType(deviceActions.writePacket.success):
            return {...state};

        case getType(motorActions.enableMotorListener):
            let motors = action.payload || [SystemOutputPort.A, SystemOutputPort.B, SystemOutputPort.C];
            let motorLabels = motors.map(s => SystemOutputPort[s]);
            for (let sensor of motorLabels) {
                state = set(state, `outputs.${sensor}.listening`, true);
            }
            return state;

        case getType(motorActions.disableMotorListener):
            motors = action.payload || [SystemOutputPort.A, SystemOutputPort.B, SystemOutputPort.C];
            motorLabels = motors.map(s => SystemOutputPort[s]);
            for (let sensor of motorLabels) {
                state = set(state, `outputs.${sensor}.listening`, false);
            }
            return state;

        case getType(sensorActions.sensorConfig.failure):
        case getType(deviceActions.writePacket.failure):
        case getType(sensorActions.sensorHandler.failure):
        case getType(motorActions.startMotorHandler.failure):
        case getType(deviceActions.writeFile.failure):
            return {...state, lastMessage: action.payload.error.message};

        case getType(motorActions.motorUpdate):
            let portId = SystemOutputPort[action.payload.port];
            let historyKey = `outputs.${portId}.dataHistory`;
            state = set(state, `outputs.${portId}.data`, action.payload);
            state = set(state, historyKey, get(state, historyKey).concat(action.payload));
            return state;

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
        case getType(motorActions.writeConfig.request):
            return {...state, outputConfig: action.payload};

        case getType(sensorActions.sensorConfig.request):
            return set(state, `inputs.${action.payload.port}.type`, action.payload.sensorType);
        case getType(sensorActions.enableSensors):
            let sensors = action.payload || [1, 2, 3, 4];
            for (let sensor of sensors) {
                state = set(state, `inputs.${sensor}.enabled`, true);
            }
            return state;
        case getType(sensorActions.disableSensors):
            sensors = action.payload || [1, 2, 3, 4];
            for (let sensor of sensors) {
                state = set(state, `inputs.${sensor}.enabled`, false);
                state = set(state, `inputs.${sensor}.dataHistory`, []);
            }
            return state;
        case getType(sensorActions.sensorUpdate):
            historyKey = `inputs.${action.payload.port}.dataHistory`;
            state = set(state, `inputs.${action.payload.port}.data`, action.payload);
            state = set(state, historyKey, get(state, historyKey).concat(action.payload));
            return state;

        case getType(coreActions.pageChange):
            switch (action.payload.scene) {
                case "motor-info-expanded":
                    let port = SystemOutputPort[action.payload.params.output];
                    for (let output of ["A", "B", "C"]) {
                        state = set(state, `outputs.${output}.listening`, false);
                        state = set(state, `outputs.${output}.dataHistory`, []);
                    }
                    state = set(state, `outputs.${port}.listening`, true);
                    break;
                case "sensor-info-expanded":
                    for (let sensor of [1, 2, 3, 4]) {
                        state = set(state, `inputs.${sensor}.enabled`, false);
                        state = set(state, `inputs.${sensor}.dataHistory`, []);
                    }
                    state = set(state, `outputs.${action.payload.params.sensor}.listening`, true);
                    break;
                case "motor-info":
                    for (let output of ["A", "B", "C"]) {
                        state = set(state, `outputs.${output}.listening`, true);
                        state = set(state, `outputs.${output}.dataHistory`, []);
                    }
                    break;
                case "sensor-info":
                    for (let sensor of [1, 2, 3, 4]) {
                        state = set(state, `inputs.${sensor}.enabled`, true);
                        state = set(state, `inputs.${sensor}.dataHistory`, []);
                    }
                    break;
                default:
                    for (let sensor of [1, 2, 3, 4]) {
                        state = set(state, `inputs.${sensor}.enabled`, false);
                        state = set(state, `inputs.${sensor}.dataHistory`, []);
                    }
                    for (let output of ["A", "B", "C"]) {
                        state = set(state, `outputs.${output}.listening`, false);
                        state = set(state, `outputs.${output}.dataHistory`, []);
                    }
            }
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

