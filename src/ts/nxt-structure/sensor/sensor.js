import { SetInputMode } from "../../../../../../Code/nxt/src/providers/nxt/packets/direct/set-input-mode";
import { LsWrite } from "../../../../../../Code/nxt/src/providers/nxt/packets/direct/ls-write";
import { Subject } from "rxjs";
import { UltrasonicSensorRegister } from "./i2c-register";
import { UltrasonicSensorCommand } from "../../../../../../Code/nxt/src/providers/nxt/ultrasonic-sensor-command";
export var InputSensorMode;
(function (InputSensorMode) {
    InputSensorMode[InputSensorMode["RAW"] = 0] = "RAW";
    InputSensorMode[InputSensorMode["BOOLEAN"] = 32] = "BOOLEAN";
    InputSensorMode[InputSensorMode["TRANSITION_COUNT"] = 64] = "TRANSITION_COUNT";
    InputSensorMode[InputSensorMode["PERIOD_COUNT"] = 96] = "PERIOD_COUNT";
    InputSensorMode[InputSensorMode["PERIOD_COUNT_FULL_SCALE"] = 128] = "PERIOD_COUNT_FULL_SCALE";
    InputSensorMode[InputSensorMode["CELSIUS"] = 160] = "CELSIUS";
    InputSensorMode[InputSensorMode["FAHRENHEIT"] = 192] = "FAHRENHEIT";
    InputSensorMode[InputSensorMode["ANGLE_STEPS"] = 224] = "ANGLE_STEPS";
})(InputSensorMode || (InputSensorMode = {}));
export var InputSensorType;
(function (InputSensorType) {
    InputSensorType[InputSensorType["NO_SENSOR"] = 0] = "NO_SENSOR";
    InputSensorType[InputSensorType["TOUCH"] = 1] = "TOUCH";
    InputSensorType[InputSensorType["TEMPERATURE"] = 2] = "TEMPERATURE";
    InputSensorType[InputSensorType["REFLECTION"] = 3] = "REFLECTION";
    InputSensorType[InputSensorType["ANGLE"] = 4] = "ANGLE";
    InputSensorType[InputSensorType["LIGHT_ACTIVE"] = 5] = "LIGHT_ACTIVE";
    InputSensorType[InputSensorType["LIGHT_INACTIVE"] = 6] = "LIGHT_INACTIVE";
    InputSensorType[InputSensorType["SOUND_DB"] = 7] = "SOUND_DB";
    InputSensorType[InputSensorType["SOUND_DBA"] = 8] = "SOUND_DBA";
    InputSensorType[InputSensorType["CUSTOM"] = 9] = "CUSTOM";
    InputSensorType[InputSensorType["LOW_SPEED"] = 10] = "LOW_SPEED";
    InputSensorType[InputSensorType["LOW_SPEED_9V"] = 11] = "LOW_SPEED_9V";
    InputSensorType[InputSensorType["NUMBER_OF_SENSOR_TYPES"] = 12] = "NUMBER_OF_SENSOR_TYPES";
})(InputSensorType || (InputSensorType = {}));
var SensorProvider = /** @class */ (function () {
    function SensorProvider() {
        this.sensorEvent$ = new Subject();
        this.lastSensorUpdate = -1;
        this.sensors = [SensorType.NONE, SensorType.NONE, SensorType.NONE, SensorType.NONE];
        this.modeMap = new Map([
            [SensorType.SOUND_DB, InputSensorMode.RAW],
            [SensorType.SOUND_DBA, InputSensorMode.RAW],
            [SensorType.LIGHT_ACTIVE, InputSensorMode.RAW],
            [SensorType.LIGHT_INACTIVE, InputSensorMode.RAW],
            [SensorType.TOUCH, InputSensorMode.BOOLEAN],
            [SensorType.ULTRASONIC_INCH, InputSensorMode.RAW],
            [SensorType.ULTRASONIC_CM, InputSensorMode.RAW],
        ]);
        this.typeMap = new Map([
            [SensorType.SOUND_DB, InputSensorType.SOUND_DB],
            [SensorType.SOUND_DBA, InputSensorType.SOUND_DBA],
            [SensorType.TOUCH, InputSensorType.TOUCH],
            [SensorType.LIGHT_ACTIVE, InputSensorType.LIGHT_ACTIVE],
            [SensorType.LIGHT_INACTIVE, InputSensorType.LIGHT_INACTIVE],
            [SensorType.ULTRASONIC_INCH, InputSensorType.LOW_SPEED_9V],
            [SensorType.ULTRASONIC_CM, InputSensorType.LOW_SPEED_9V],
        ]);
    }
    SensorProvider.prototype.setSensorType = function (type, port) {
        var _this = this;
        var sensorsExist = this.sensors.filter(function (type) { return type != SensorType.NONE; }).length != 0;
        this.sensors[port] = type;
        if (type == SensorType.NONE)
            return;
        if (type == SensorType.ULTRASONIC_CM || type == SensorType.ULTRASONIC_INCH) {
            this.initUS(port);
        }
        this.nxt.writePacket(true, SetInputMode.createPacket(port, this.typeMap.get(type), this.modeMap.get(type)));
        if (!sensorsExist) {
            setTimeout(function () {
                //directly tick this sensor if none are in use
                _this.lastSensorUpdate = port - 1;
                _this.tickNextSensor();
            }, 1000);
        }
    };
    SensorProvider.prototype.initUS = function (port) {
        var _this = this;
        setTimeout(function () {
            _this.nxt.writePacket(true, LsWrite.createPacket(port, [0x02, UltrasonicSensorRegister.COMMAND, UltrasonicSensorCommand.CONTINUOUS_MEASUREMENT], 0));
        }, 1000);
    };
    SensorProvider.CM_TO_INCH = 0.393700;
    return SensorProvider;
}());
export { SensorProvider };
export var SensorType;
(function (SensorType) {
    SensorType["LIGHT_ACTIVE"] = "Light (Active)";
    SensorType["LIGHT_INACTIVE"] = "Light (Inactive)";
    SensorType["SOUND_DB"] = "Sound (dB)";
    SensorType["SOUND_DBA"] = "Sound (dBa)";
    SensorType["TOUCH"] = "Touch";
    SensorType["ULTRASONIC_CM"] = "Ultrasonic (cm)";
    SensorType["ULTRASONIC_INCH"] = "Ultrasonic (inch)";
    SensorType["NONE"] = "No Sensor";
})(SensorType || (SensorType = {}));
