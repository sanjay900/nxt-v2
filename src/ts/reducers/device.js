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
import { MultiOutputPort, OutputRegulationMode, OutputRunState, SingleOutputPort, SteeringConfig } from "../nxt-structure/motor/motor-constants";
import { InputSensorMode, InputSensorType, SensorType } from "../nxt-structure/sensor/sensor";
import { SystemCommand } from "../nxt-structure/packets/system-command";
import { getType } from "typesafe-actions";
import * as deviceActions from "../actions/device-actions";
import { DirectCommand } from "../nxt-structure/packets/direct-command";
var initialSensor = {
    type: SensorType.NONE,
    systemType: InputSensorType.NO_SENSOR,
    mode: InputSensorMode.RAW,
    dataHistory: [],
    data: {
        rawValue: 0,
        scaledValue: 0
    }
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
        }
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
    }
};
export var device = function (state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case getType(deviceActions.readPacket):
            return __assign({}, state, processPacket(action.payload.packet));
        case getType(deviceActions.writePacket.failure):
            return __assign({}, state, { lastMessage: action.payload.message });
        case getType(deviceActions.setName):
            return __assign({}, state, { info: {
                    deviceName: action.payload
                } });
    }
    return state;
};
function processPacket(packet) {
    switch (packet.id) {
        case SystemCommand.GET_DEVICE_INFO:
            var _a = packet, deviceName = _a.name, btAddress = _a.btAddress, btSignalStrength = _a.btSignalStrength, freeSpace = _a.freeSpace;
            return {
                info: { deviceName: deviceName, btSignalStrength: btSignalStrength, btAddress: btAddress, freeSpace: freeSpace }
            };
        case SystemCommand.GET_FIRMWARE_VERSION:
            var _b = packet, firmware = _b.firmwareVersion, protocol = _b.protocolVersion;
            return {
                info: {
                    version: { firmware: firmware, protocol: protocol }
                }
            };
        case DirectCommand.GET_BATTERY_LEVEL:
            var voltage = packet.voltage;
            return {
                info: {
                    batteryVoltage: voltage
                }
            };
    }
    return {};
}
