import {Subject} from "rxjs";
import {UltrasonicSensorRegister} from "./i2c-register";

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

export class SensorProvider {
  private static readonly CM_TO_INCH = 0.393700;
  public sensorEvent$: Subject<SensorData> = new Subject<SensorData>();
  private lastSensorUpdate: number = -1;
  private sensors: SensorType[] = [SensorType.NONE, SensorType.NONE, SensorType.NONE, SensorType.NONE];
  private modeMap: Map<SensorType, InputSensorMode> = new Map<SensorType, InputSensorMode>([
    [SensorType.SOUND_DB, InputSensorMode.RAW],
    [SensorType.SOUND_DBA, InputSensorMode.RAW],
    [SensorType.LIGHT_ACTIVE, InputSensorMode.RAW],
    [SensorType.LIGHT_INACTIVE, InputSensorMode.RAW],
    [SensorType.TOUCH, InputSensorMode.BOOLEAN],
    [SensorType.ULTRASONIC_INCH, InputSensorMode.RAW],
    [SensorType.ULTRASONIC_CM, InputSensorMode.RAW],
  ]);
  private typeMap: Map<SensorType, InputSensorType> = new Map<SensorType, InputSensorType>([
    [SensorType.SOUND_DB, InputSensorType.SOUND_DB],
    [SensorType.SOUND_DBA, InputSensorType.SOUND_DBA],
    [SensorType.TOUCH, InputSensorType.TOUCH],
    [SensorType.LIGHT_ACTIVE, InputSensorType.LIGHT_ACTIVE],
    [SensorType.LIGHT_INACTIVE, InputSensorType.LIGHT_INACTIVE],
    [SensorType.ULTRASONIC_INCH, InputSensorType.LOW_SPEED_9V],
    [SensorType.ULTRASONIC_CM, InputSensorType.LOW_SPEED_9V],
  ]);

  setSensorType(type: SensorType, port: number) {
    let sensorsExist = this.sensors.filter(type => type != SensorType.NONE).length != 0;
    this.sensors[port] = type;
    if (type == SensorType.NONE) return;
    if (type == SensorType.ULTRASONIC_CM || type == SensorType.ULTRASONIC_INCH) {
      this.initUS(port);
    }
  }


}

export type SensorData = {
  rawValue: number,
  scaledValue: number,
  port: number;
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
