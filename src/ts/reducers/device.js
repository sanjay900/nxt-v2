var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
import { MultiOutputPort, OutputRegulationMode, OutputRunState, SingleOutputPort, SteeringConfig } from "../nxt-structure/motor-constants";
import { InputSensorMode, InputSensorType, SensorType } from "../nxt-structure/sensor-constants";
import { SystemCommand } from "../nxt-structure/packets/system-command";
import { getType } from "typesafe-actions";
import * as deviceActions from "../actions/device-actions";
import { DirectCommand } from "../nxt-structure/packets/direct-command";
import { connectToDevice } from "../actions/bluetooth-actions";
import { set } from "dot-prop-immutable";
var initialSensor = {
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
var initialOutput = {
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
var initialState = {
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
        A: __assign({}, initialOutput),
        B: __assign({}, initialOutput),
        C: __assign({}, initialOutput)
    }, inputs: {
        1: __assign({}, initialSensor),
        2: __assign({}, initialSensor),
        3: __assign({}, initialSensor),
        4: __assign({}, initialSensor)
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
export var device = function (state, action) {
    if (state === void 0) { state = initialState; }
    var e_1, _a;
    switch (action.type) {
        case getType(connectToDevice.success):
            return __assign({}, state, { info: __assign({}, state.info, { programToUpload: undefined }) });
        case getType(deviceActions.readPacket):
            return __assign({}, state, processIncomingPacket(action.payload.packet, state));
        case getType(deviceActions.writeFileProgress):
            return __assign({}, state, { info: __assign({}, state.info, { currentFile: action.payload.packet.file }) });
        case getType(deviceActions.writeFile.failure):
            console.error(action.payload);
            return __assign({}, state, { lastMessage: action.payload.error.message });
        case getType(deviceActions.writePacket.request):
            return __assign({}, state, processOutgoingPacket(action.payload, state));
        case getType(deviceActions.writePacket.success):
            return __assign({}, state);
        case getType(deviceActions.sensorConfig.failure):
            console.log("config", action.payload.error, DirectCommand[action.payload.packet.id], SystemCommand[action.payload.packet.id]);
            return __assign({}, state, { lastMessage: action.payload.error.message });
        case getType(deviceActions.sensorHandler.failure):
            console.log("handler", action.payload.error, DirectCommand[action.payload.packet.id], SystemCommand[action.payload.packet.id]);
            return __assign({}, state, { lastMessage: action.payload.error.message });
        case getType(deviceActions.writePacket.failure):
            console.log(action.payload);
            return __assign({}, state, { lastMessage: action.payload.error.message });
        case getType(deviceActions.joystickMove):
            if (action.payload.name == "STEERING") {
                return __assign({}, state, { outputConfig: __assign({}, state.outputConfig, { targetAngle: action.payload.x * 41 }) });
            }
            else {
                return __assign({}, state, { outputConfig: __assign({}, state.outputConfig, { power: action.payload.y * 41 }) });
            }
        case getType(deviceActions.joystickRelease):
            if (action.payload == "STEERING") {
                return __assign({}, state, { outputConfig: __assign({}, state.outputConfig, { targetAngle: 0 }) });
            }
            else {
                return __assign({}, state, { outputConfig: __assign({}, state.outputConfig, { power: 0 }) });
            }
        case getType(deviceActions.writeConfig.request):
            return __assign({}, state, { outputConfig: action.payload });
        case getType(deviceActions.sensorConfig.request):
            return set(state, "inputs." + action.payload.port + ".type", action.payload.sensorType);
        case getType(deviceActions.enableSensors):
            var sensors = action.payload || [1, 2, 3, 4];
            try {
                for (var sensors_1 = __values(sensors), sensors_1_1 = sensors_1.next(); !sensors_1_1.done; sensors_1_1 = sensors_1.next()) {
                    var sensor = sensors_1_1.value;
                    state = set(state, "inputs." + sensor + ".enabled", true);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (sensors_1_1 && !sensors_1_1.done && (_a = sensors_1.return)) _a.call(sensors_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return state;
        case getType(deviceActions.disableSensors):
            state = set(state, "inputs.1.enabled", false);
            state = set(state, "inputs.2.enabled", false);
            state = set(state, "inputs.3.enabled", false);
            state = set(state, "inputs.4.enabled", false);
            return state;
        case getType(deviceActions.sensorUpdate):
            console.log(action);
            return state;
    }
    return state;
};
function processOutgoingPacket(packet, state) {
    switch (packet.id) {
        case SystemCommand.SET_BRICK_NAME:
            var deviceName = packet.name;
            return {
                info: __assign({}, state.info, { deviceName: deviceName })
            };
    }
    return {};
}
function processIncomingPacket(packet, state) {
    switch (packet.id) {
        case SystemCommand.GET_DEVICE_INFO:
            var _a = packet, deviceName = _a.name, btAddress = _a.btAddress, btSignalStrength = _a.btSignalStrength, freeSpace = _a.freeSpace;
            return {
                info: __assign({}, state.info, { deviceName: deviceName, btSignalStrength: btSignalStrength, btAddress: btAddress, freeSpace: freeSpace })
            };
        case SystemCommand.GET_FIRMWARE_VERSION:
            var _b = packet, firmware = _b.firmwareVersion, protocol = _b.protocolVersion;
            return {
                info: __assign({}, state.info, { version: { firmware: firmware, protocol: protocol } })
            };
        case DirectCommand.GET_BATTERY_LEVEL:
            var voltage = packet.voltage;
            return {
                info: __assign({}, state.info, { batteryVoltage: voltage })
            };
    }
    return {};
}
