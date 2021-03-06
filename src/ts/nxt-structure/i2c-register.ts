export enum StandardI2CSensorRegister {
    READ_VERSION = 0x00,
    READ_PRODUCT_ID = 0x08,
    READ_SENSOR_TYPE = 0x10,
}

export enum UltrasonicSensorRegister {
    FACTORY_ZERO = 0x11,
    FACTORY_SCALE_FACTOR = 0x12,
    FACTORY_SCALE_DIVISOR = 0x13,
    MEASUREMENT_UNITS = 0x14,
    CONTIUNOUS_MEASUREMENT_INTERVAL = 0x40,
    COMMAND = 0x41,
    MEASUREMENT_BYTE_0 = 0x42,
    MEASUREMENT_BYTE_1 = 0x43,
    MEASUREMENT_BYTE_2 = 0x44,
    MEASUREMENT_BYTE_3 = 0x45,
    MEASUREMENT_BYTE_4 = 0x46,
    MEASUREMENT_BYTE_5 = 0x47,
    MEASUREMENT_BYTE_6 = 0x48,
    MEASUREMENT_BYTE_7 = 0x49,
    ACTUAL_ZERO = 0x4a,
    ACTUAL_SCALE_FACTOR = 0x4b,
    ACTUAL_SCALE_DIVISOR = 0x4c
}

export type I2CSensorRegister = StandardI2CSensorRegister | UltrasonicSensorRegister;
