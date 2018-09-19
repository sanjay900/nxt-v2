import { LsRead } from "../../../../../../Code/nxt/src/providers/nxt/packets/direct/ls-read";
import { SetInputMode } from "../../../../../../Code/nxt/src/providers/nxt/packets/direct/set-input-mode";
import { LsWrite } from "../../../../../../Code/nxt/src/providers/nxt/packets/direct/ls-write";
import { LsGetStatus } from "../../../../../../Code/nxt/src/providers/nxt/packets/direct/ls-get-status";
import { Subject } from "rxjs";
import { GetInputValues } from "../../../../../../Code/nxt/src/providers/nxt/packets/direct/get-input-values";
import { ConnectionStatus } from "../../../../../../Code/nxt/src/providers/bluetooth/bluetooth";
import { DirectCommand } from "../../../../../../Code/nxt/src/providers/nxt/packets/direct-command";
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
    function SensorProvider(nxt, bluetooth) {
        var _this = this;
        this.nxt = nxt;
        this.bluetooth = bluetooth;
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
        this.bluetooth.deviceStatus$
            .filter(function (status) { return status.status == ConnectionStatus.CONNECTED; })
            .subscribe(function () {
            _this.sensors.forEach(_this.setSensorType.bind(_this));
            _this.tickNextSensor();
        });
        this.nxt.packetEvent$
            .filter(function (packet) { return packet.id == DirectCommand.LS_READ; })
            .subscribe(function (packet) {
            if (packet.bytesRead > 0) {
                var data = packet.rxData[0];
                if (_this.sensors[_this.lastSensorUpdate] == SensorType.ULTRASONIC_INCH) {
                    data *= SensorProvider.CM_TO_INCH;
                }
                _this.sensorEvent$.next(new SensorData(_this.lastSensorUpdate, data, data, _this.sensors[_this.lastSensorUpdate]));
                _this.tickNextSensor();
            }
        });
        this.nxt.packetEvent$
            .filter(function (packet) { return packet.id == DirectCommand.GET_INPUT_VALUES; })
            .subscribe(function (packet) {
            if (packet.valid) {
                _this.sensorEvent$.next(new SensorData(packet.port, packet.rawValue, packet.scaledValue, _this.sensors[packet.port]));
            }
            _this.tickNextSensor();
        });
    }
    SensorProvider.prototype.disableAllSensors = function () {
        var _this = this;
        this.sensors.forEach(function (type, port) {
            _this.setSensorType(SensorType.NONE, port);
        });
    };
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
    SensorProvider.prototype.readI2CRegister = function (register, port) {
        var _this = this;
        var timer = setInterval(function () {
            _this.nxt.writePacket(true, LsWrite.createPacket(port, [0x02, register], 1));
            _this.nxt.writePacket(true, LsGetStatus.createPacket(port));
        }, 10);
        var subscription = this.nxt.packetEvent$
            .filter(function (packet) { return packet.id == DirectCommand.LS_GET_STATUS; })
            .subscribe(function (packet) {
            if (packet.bytesReady > 0) {
                clearInterval(timer);
                subscription.unsubscribe();
                _this.nxt.writePacket(true, LsRead.createPacket(port));
            }
        });
    };
    SensorProvider.prototype.tickNextSensor = function () {
        var sensorsExist = this.sensors.filter(function (type) { return type != SensorType.NONE; }).length != 0;
        if (!sensorsExist)
            return;
        this.lastSensorUpdate++;
        if (this.lastSensorUpdate >= 4) {
            this.lastSensorUpdate = 0;
        }
        switch (this.sensors[this.lastSensorUpdate]) {
            case SensorType.ULTRASONIC_INCH:
            case SensorType.ULTRASONIC_CM:
                this.readI2CRegister(UltrasonicSensorRegister.MEASUREMENT_BYTE_0, this.lastSensorUpdate);
                break;
            case SensorType.NONE:
                this.tickNextSensor();
                break;
            default:
                this.nxt.writePacket(true, GetInputValues.createPacket(this.lastSensorUpdate));
                break;
        }
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
