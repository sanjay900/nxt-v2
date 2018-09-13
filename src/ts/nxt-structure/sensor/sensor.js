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
