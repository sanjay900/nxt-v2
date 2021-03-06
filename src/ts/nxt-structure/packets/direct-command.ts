export enum DirectCommand {
    START_PROGRAM = 0x00,
    STOP_PROGRAM = 0x01,
    PLAY_SOUND_FILE = 0x02,
    PLAY_TONE = 0x03,
    SET_OUTPUT_STATE = 0x04,
    SET_INPUT_MODE = 0x05,
    GET_OUTPUT_STATE = 0x06,
    GET_INPUT_VALUES = 0x07,
    RESET_INPUT_SCALED_VALUE = 0x08,
    MESSAGE_WRITE = 0x09,
    RESET_MOTOR_POSITION = 0x0A,
    GET_BATTERY_LEVEL = 0x0B,
    STOP_SOUND_PLAYBACK = 0x0C,
    KEEP_ALIVE = 0x0D,
    LS_GET_STATUS = 0x0E,
    LS_WRITE = 0x0F,
    LS_READ = 0x10,
    GET_CURRENT_PROGRAM_NAME = 0x11,
    MESSAGE_READ = 0x13
}
