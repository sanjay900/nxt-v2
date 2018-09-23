import {SystemOutputPort} from "./motor-constants";

export enum InputSensorMode {
    RAW = 0x00,
    BOOLEAN = 0x20,
    TRANSITION_COUNT = 0x40,
    PERIOD_COUNT = 0x60,
    PERIOD_COUNT_FULL_SCALE = 0x80,
    CELSIUS = 0xA0,
    FAHRENHEIT = 0xC0,
    ANGLE_STEPS = 0xE0
}

export enum InputSensorType {
    NO_SENSOR = 0x00,
    TOUCH = 0x01,
    TEMPERATURE = 0x02,
    REFLECTION = 0x03,
    ANGLE = 0x04,
    LIGHT_ACTIVE = 0x05,
    LIGHT_INACTIVE = 0x06,
    SOUND_DB = 0x07,
    SOUND_DBA = 0x08,
    CUSTOM = 0x09,
    LOW_SPEED = 0x0A,
    LOW_SPEED_9V = 0x0B,
    NUMBER_OF_SENSOR_TYPES = 0x0C
}

export type SensorData = {
    rawValue: number,
    scaledValue: number,
    port: number,
    [key: string]: number
}

export enum SensorType {
    LIGHT_ACTIVE = "Light (Active)",
    LIGHT_INACTIVE = "Light (Inactive)",
    SOUND_DB = "Sound (dB)",
    SOUND_DBA = "Sound (dBa)",
    TOUCH = "Touch",
    ULTRASONIC_CM = "Ultrasonic (cm)",
    ULTRASONIC_INCH = "Ultrasonic (inch)",
    NONE = "No Sensor"
}
