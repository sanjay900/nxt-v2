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
import { MultiOutputPort, OutputRegulationMode, OutputRunState, SingleOutputPort, SteeringConfig, SystemOutputPort } from "../nxt-structure/motor-constants";
import { InputSensorMode, InputSensorType, SensorType } from "../nxt-structure/sensor-constants";
import { SystemCommand } from "../nxt-structure/packets/system-command";
import { getType } from "typesafe-actions";
import * as deviceActions from "../actions/device-actions";
import * as motorActions from "../actions/motor-actions";
import * as sensorActions from "../actions/sensor-actions";
import { DirectCommand } from "../nxt-structure/packets/direct-command";
import { connectToDevice } from "../actions/bluetooth-actions";
import { get, set } from "dot-prop-immutable";
import * as coreActions from "../actions/core-actions";
var initialSensor = function (port) { return ({
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
}); };
export var initialOutput = function (port) { return ({
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
        port: port
    },
    dataHistory: [],
    listening: false
}); };
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
        A: __assign({}, initialOutput(SystemOutputPort.A)),
        B: __assign({}, initialOutput(SystemOutputPort.B)),
        C: __assign({}, initialOutput(SystemOutputPort.C))
    }, inputs: {
        1: __assign({}, initialSensor(1)),
        2: __assign({}, initialSensor(2)),
        3: __assign({}, initialSensor(3)),
        4: __assign({}, initialSensor(4))
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
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f, e_7, _g, e_8, _h, e_9, _j, e_10, _k;
    switch (action.type) {
        case getType(connectToDevice.success):
            return __assign({}, state, { info: __assign({}, state.info, { programToUpload: undefined }) });
        case getType(deviceActions.readPacket):
            return __assign({}, state, processIncomingPacket(action.payload.packet, state));
        case getType(deviceActions.writeFileProgress):
            return __assign({}, state, { info: __assign({}, state.info, { currentFile: action.payload.packet.file }) });
        case getType(deviceActions.writePacket.request):
            return __assign({}, state, processOutgoingPacket(action.payload, state));
        case getType(deviceActions.writePacket.success):
            return __assign({}, state);
        case getType(motorActions.enableMotorListener):
            var motors = action.payload || [SystemOutputPort.A, SystemOutputPort.B, SystemOutputPort.C];
            var motorLabels = motors.map(function (s) { return SystemOutputPort[s]; });
            try {
                for (var motorLabels_1 = __values(motorLabels), motorLabels_1_1 = motorLabels_1.next(); !motorLabels_1_1.done; motorLabels_1_1 = motorLabels_1.next()) {
                    var sensor = motorLabels_1_1.value;
                    state = set(state, "outputs." + sensor + ".listening", true);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (motorLabels_1_1 && !motorLabels_1_1.done && (_a = motorLabels_1.return)) _a.call(motorLabels_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return state;
        case getType(motorActions.disableMotorListener):
            motors = action.payload || [SystemOutputPort.A, SystemOutputPort.B, SystemOutputPort.C];
            motorLabels = motors.map(function (s) { return SystemOutputPort[s]; });
            try {
                for (var motorLabels_2 = __values(motorLabels), motorLabels_2_1 = motorLabels_2.next(); !motorLabels_2_1.done; motorLabels_2_1 = motorLabels_2.next()) {
                    var sensor = motorLabels_2_1.value;
                    state = set(state, "outputs." + sensor + ".listening", false);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (motorLabels_2_1 && !motorLabels_2_1.done && (_b = motorLabels_2.return)) _b.call(motorLabels_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return state;
        case getType(sensorActions.sensorConfig.failure):
        case getType(deviceActions.writePacket.failure):
        case getType(sensorActions.sensorHandler.failure):
        case getType(motorActions.startMotorHandler.failure):
        case getType(deviceActions.writeFile.failure):
            return __assign({}, state, { lastMessage: action.payload.error.message });
        case getType(motorActions.motorUpdate):
            var portId = SystemOutputPort[action.payload.port];
            var historyKey = "outputs." + portId + ".dataHistory";
            state = set(state, "outputs." + portId + ".data", action.payload);
            state = set(state, historyKey, get(state, historyKey).concat(action.payload));
            return state;
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
        case getType(motorActions.writeConfig.request):
            return __assign({}, state, { outputConfig: action.payload });
        case getType(sensorActions.sensorConfig.request):
            return set(state, "inputs." + action.payload.port + ".type", action.payload.sensorType);
        case getType(sensorActions.enableSensors):
            var sensors = action.payload || [1, 2, 3, 4];
            try {
                for (var sensors_1 = __values(sensors), sensors_1_1 = sensors_1.next(); !sensors_1_1.done; sensors_1_1 = sensors_1.next()) {
                    var sensor = sensors_1_1.value;
                    state = set(state, "inputs." + sensor + ".enabled", true);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (sensors_1_1 && !sensors_1_1.done && (_c = sensors_1.return)) _c.call(sensors_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return state;
        case getType(sensorActions.disableSensors):
            sensors = action.payload || [1, 2, 3, 4];
            try {
                for (var sensors_2 = __values(sensors), sensors_2_1 = sensors_2.next(); !sensors_2_1.done; sensors_2_1 = sensors_2.next()) {
                    var sensor = sensors_2_1.value;
                    state = set(state, "inputs." + sensor + ".enabled", false);
                    state = set(state, "inputs." + sensor + ".dataHistory", []);
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (sensors_2_1 && !sensors_2_1.done && (_d = sensors_2.return)) _d.call(sensors_2);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return state;
        case getType(sensorActions.sensorUpdate):
            historyKey = "inputs." + action.payload.port + ".dataHistory";
            state = set(state, "inputs." + action.payload.port + ".data", action.payload);
            state = set(state, historyKey, get(state, historyKey).concat(action.payload));
            return state;
        case getType(coreActions.pageChange):
            switch (action.payload.scene) {
                case "motor-info-expanded":
                    var port = SystemOutputPort[action.payload.params.output];
                    try {
                        for (var _l = __values(["A", "B", "C"]), _m = _l.next(); !_m.done; _m = _l.next()) {
                            var output = _m.value;
                            state = set(state, "outputs." + output + ".listening", false);
                            state = set(state, "outputs." + output + ".dataHistory", []);
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (_m && !_m.done && (_e = _l.return)) _e.call(_l);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                    state = set(state, "outputs." + port + ".listening", true);
                    break;
                case "sensor-info-expanded":
                    try {
                        for (var _o = __values([1, 2, 3, 4]), _p = _o.next(); !_p.done; _p = _o.next()) {
                            var sensor = _p.value;
                            state = set(state, "inputs." + sensor + ".enabled", false);
                            state = set(state, "inputs." + sensor + ".dataHistory", []);
                        }
                    }
                    catch (e_6_1) { e_6 = { error: e_6_1 }; }
                    finally {
                        try {
                            if (_p && !_p.done && (_f = _o.return)) _f.call(_o);
                        }
                        finally { if (e_6) throw e_6.error; }
                    }
                    state = set(state, "outputs." + action.payload.params.sensor + ".listening", true);
                    break;
                case "motor-info":
                    try {
                        for (var _q = __values(["A", "B", "C"]), _r = _q.next(); !_r.done; _r = _q.next()) {
                            var output = _r.value;
                            state = set(state, "outputs." + output + ".listening", true);
                            state = set(state, "outputs." + output + ".dataHistory", []);
                        }
                    }
                    catch (e_7_1) { e_7 = { error: e_7_1 }; }
                    finally {
                        try {
                            if (_r && !_r.done && (_g = _q.return)) _g.call(_q);
                        }
                        finally { if (e_7) throw e_7.error; }
                    }
                    break;
                case "sensor-info":
                    try {
                        for (var _s = __values([1, 2, 3, 4]), _t = _s.next(); !_t.done; _t = _s.next()) {
                            var sensor = _t.value;
                            state = set(state, "inputs." + sensor + ".enabled", true);
                            state = set(state, "inputs." + sensor + ".dataHistory", []);
                        }
                    }
                    catch (e_8_1) { e_8 = { error: e_8_1 }; }
                    finally {
                        try {
                            if (_t && !_t.done && (_h = _s.return)) _h.call(_s);
                        }
                        finally { if (e_8) throw e_8.error; }
                    }
                    break;
                default:
                    try {
                        for (var _u = __values([1, 2, 3, 4]), _v = _u.next(); !_v.done; _v = _u.next()) {
                            var sensor = _v.value;
                            state = set(state, "inputs." + sensor + ".enabled", false);
                            state = set(state, "inputs." + sensor + ".dataHistory", []);
                        }
                    }
                    catch (e_9_1) { e_9 = { error: e_9_1 }; }
                    finally {
                        try {
                            if (_v && !_v.done && (_j = _u.return)) _j.call(_u);
                        }
                        finally { if (e_9) throw e_9.error; }
                    }
                    try {
                        for (var _w = __values(["A", "B", "C"]), _x = _w.next(); !_x.done; _x = _w.next()) {
                            var output = _x.value;
                            state = set(state, "outputs." + output + ".listening", false);
                            state = set(state, "outputs." + output + ".dataHistory", []);
                        }
                    }
                    catch (e_10_1) { e_10 = { error: e_10_1 }; }
                    finally {
                        try {
                            if (_x && !_x.done && (_k = _w.return)) _k.call(_w);
                        }
                        finally { if (e_10) throw e_10.error; }
                    }
            }
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
