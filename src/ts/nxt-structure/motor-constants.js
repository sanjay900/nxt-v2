export var SteeringConfig;
(function (SteeringConfig) {
    SteeringConfig["FRONT_STEERING"] = "0";
    SteeringConfig["TANK"] = "1";
})(SteeringConfig || (SteeringConfig = {}));
export var SystemOutputPort;
(function (SystemOutputPort) {
    SystemOutputPort[SystemOutputPort["A"] = 0] = "A";
    SystemOutputPort[SystemOutputPort["B"] = 1] = "B";
    SystemOutputPort[SystemOutputPort["C"] = 2] = "C";
    SystemOutputPort[SystemOutputPort["ALL"] = 255] = "ALL";
})(SystemOutputPort || (SystemOutputPort = {}));
export var OutputRegulationMode;
(function (OutputRegulationMode) {
    OutputRegulationMode[OutputRegulationMode["IDLE"] = 0] = "IDLE";
    OutputRegulationMode[OutputRegulationMode["MOTOR_SPEED"] = 1] = "MOTOR_SPEED";
    OutputRegulationMode[OutputRegulationMode["MOTOR_SYNC"] = 2] = "MOTOR_SYNC";
})(OutputRegulationMode || (OutputRegulationMode = {}));
export var OutputMode;
(function (OutputMode) {
    OutputMode[OutputMode["MOTOR_ON"] = 1] = "MOTOR_ON";
    OutputMode[OutputMode["BRAKE"] = 2] = "BRAKE";
    OutputMode[OutputMode["REGULATED"] = 4] = "REGULATED";
})(OutputMode || (OutputMode = {}));
export var MultiOutputPort;
(function (MultiOutputPort) {
    MultiOutputPort["A_B"] = "4";
    MultiOutputPort["A_C"] = "5";
    MultiOutputPort["B_C"] = "6";
    MultiOutputPort["A_B_C"] = "7";
})(MultiOutputPort || (MultiOutputPort = {}));
export var SingleOutputPort;
(function (SingleOutputPort) {
    SingleOutputPort["A"] = "1";
    SingleOutputPort["B"] = "2";
    SingleOutputPort["C"] = "3";
})(SingleOutputPort || (SingleOutputPort = {}));
export function printMode(mode) {
    var ret = [];
    if (mode & OutputMode.MOTOR_ON) {
        ret.push("Motor On");
    }
    if (mode & OutputMode.BRAKE) {
        ret.push("Brake");
    }
    if (mode & OutputMode.BRAKE) {
        ret.push("Regulated");
    }
    if (ret.length == 0)
        return "No modes set";
    return ret.join(", ");
}
var SystemOutputPortUtils = /** @class */ (function () {
    function SystemOutputPortUtils() {
    }
    SystemOutputPortUtils.fromOutputPort = function (port) {
        var ports = [];
        if (port == SingleOutputPort.A || port == MultiOutputPort.A_B || port == MultiOutputPort.A_C || port == MultiOutputPort.A_B_C) {
            ports.push(SystemOutputPort.A);
        }
        if (port == SingleOutputPort.B || port == MultiOutputPort.A_B || port == MultiOutputPort.B_C || port == MultiOutputPort.A_B_C) {
            ports.push(SystemOutputPort.B);
        }
        if (port == SingleOutputPort.C || port == MultiOutputPort.A_C || port == MultiOutputPort.B_C || port == MultiOutputPort.A_B_C) {
            ports.push(SystemOutputPort.C);
        }
        return ports;
    };
    return SystemOutputPortUtils;
}());
export { SystemOutputPortUtils };
export var OutputRunState;
(function (OutputRunState) {
    OutputRunState[OutputRunState["IDLE"] = 0] = "IDLE";
    OutputRunState[OutputRunState["RAMP_UP"] = 16] = "RAMP_UP";
    OutputRunState[OutputRunState["RUNNING"] = 32] = "RUNNING";
    OutputRunState[OutputRunState["RAMP_DOWN"] = 64] = "RAMP_DOWN";
})(OutputRunState || (OutputRunState = {}));
