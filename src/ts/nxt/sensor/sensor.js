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
// export class SensorProvider {
//   private static readonly CM_TO_INCH = 0.393700;
//   public sensorEvent$: Subject<SensorData> = new Subject<SensorData>();
//   private lastSensorUpdate: number = -1;
//   private sensors: SensorType[] = [SensorType.NONE, SensorType.NONE, SensorType.NONE, SensorType.NONE];
//   private modeMap: Map<SensorType, InputSensorMode> = new Map<SensorType, InputSensorMode>([
//     [SensorType.SOUND_DB, InputSensorMode.RAW],
//     [SensorType.SOUND_DBA, InputSensorMode.RAW],
//     [SensorType.LIGHT_ACTIVE, InputSensorMode.RAW],
//     [SensorType.LIGHT_INACTIVE, InputSensorMode.RAW],
//     [SensorType.TOUCH, InputSensorMode.BOOLEAN],
//     [SensorType.ULTRASONIC_INCH, InputSensorMode.RAW],
//     [SensorType.ULTRASONIC_CM, InputSensorMode.RAW],
//   ]);
//   private typeMap: Map<SensorType, InputSensorType> = new Map<SensorType, InputSensorType>([
//     [SensorType.SOUND_DB, InputSensorType.SOUND_DB],
//     [SensorType.SOUND_DBA, InputSensorType.SOUND_DBA],
//     [SensorType.TOUCH, InputSensorType.TOUCH],
//     [SensorType.LIGHT_ACTIVE, InputSensorType.LIGHT_ACTIVE],
//     [SensorType.LIGHT_INACTIVE, InputSensorType.LIGHT_INACTIVE],
//     [SensorType.ULTRASONIC_INCH, InputSensorType.LOW_SPEED_9V],
//     [SensorType.ULTRASONIC_CM, InputSensorType.LOW_SPEED_9V],
//   ]);
//
//   constructor(private nxt: NxtPacketProvider, private bluetooth: BluetoothProvider) {
//     this.bluetooth.deviceStatus$
//       .filter(status => status.status == ConnectionStatus.CONNECTED)
//       .subscribe(()=>{
//         this.sensors.forEach(this.setSensorType.bind(this));
//         this.tickNextSensor();
//       });
//     this.nxt.packetEvent$
//       .filter(packet => packet.id == DirectCommand.LS_READ)
//       .subscribe((packet: LsRead) => {
//         if (packet.bytesRead > 0) {
//           let data = packet.rxData[0];
//           if (this.sensors[this.lastSensorUpdate] == SensorType.ULTRASONIC_INCH) {
//             data *= SensorProvider.CM_TO_INCH;
//           }
//           this.sensorEvent$.next(new SensorData(
//             this.lastSensorUpdate,
//             data,
//             data,
//             this.sensors[this.lastSensorUpdate]
//           ));
//           this.tickNextSensor();
//         }
//       });
//     this.nxt.packetEvent$
//       .filter(packet => packet.id == DirectCommand.GET_INPUT_VALUES)
//       .subscribe((packet: GetInputValues) => {
//         if (packet.valid) {
//           this.sensorEvent$.next(new SensorData(
//             packet.port,
//             packet.rawValue,
//             packet.scaledValue,
//             this.sensors[packet.port]
//           ));
//         }
//         this.tickNextSensor();
//       });
//
//   }
//
//   disableAllSensors() {
//     this.sensors.forEach((type, port) => {
//       this.setSensorType(SensorType.NONE, port);
//     })
//   }
//
//   setSensorType(type: SensorType, port: number) {
//     let sensorsExist = this.sensors.filter(type => type != SensorType.NONE).length != 0;
//     this.sensors[port] = type;
//     if (type == SensorType.NONE) return;
//     if (type == SensorType.ULTRASONIC_CM || type == SensorType.ULTRASONIC_INCH) {
//       this.initUS(port);
//     }
//     this.nxt.writePacket(true, SetInputMode.createPacket(port, this.typeMap.get(type), this.modeMap.get(type)));
//     if (!sensorsExist) {
//       setTimeout(() => {
//         //directly tick this sensor if none are in use
//         this.lastSensorUpdate = port - 1;
//         this.tickNextSensor();
//       }, 1000)
//     }
//   }
//
//   initUS(port: number) {
//     setTimeout(() => {
//       this.nxt.writePacket(true, LsWrite.createPacket(port, [0x02, UltrasonicSensorRegister.COMMAND, UltrasonicSensorCommand.CONTINUOUS_MEASUREMENT], 0));
//     }, 1000);
//   }
//
//   readI2CRegister(register: number, port: number) {
//     let timer: number = setInterval(() => {
//       this.nxt.writePacket(true, LsWrite.createPacket(port, [0x02, register], 1));
//       this.nxt.writePacket(true, LsGetStatus.createPacket(port));
//     }, 10);
//     let subscription = this.nxt.packetEvent$
//       .filter(packet => packet.id == DirectCommand.LS_GET_STATUS)
//       .subscribe((packet: LsGetStatus) => {
//         if (packet.bytesReady > 0) {
//           clearInterval(timer);
//           subscription.unsubscribe();
//           this.nxt.writePacket(true, LsRead.createPacket(port));
//         }
//       });
//   }
//
//   private tickNextSensor() {
//     let sensorsExist = this.sensors.filter(type => type != SensorType.NONE).length != 0;
//     if (!sensorsExist) return;
//     this.lastSensorUpdate++;
//     if (this.lastSensorUpdate >= 4) {
//       this.lastSensorUpdate = 0;
//     }
//     switch (this.sensors[this.lastSensorUpdate]) {
//       case SensorType.ULTRASONIC_INCH:
//       case SensorType.ULTRASONIC_CM:
//         this.readI2CRegister(UltrasonicSensorRegister.MEASUREMENT_BYTE_0, this.lastSensorUpdate);
//         break;
//       case SensorType.NONE:
//         this.tickNextSensor();
//         break;
//       default:
//         this.nxt.writePacket(true, GetInputValues.createPacket(this.lastSensorUpdate));
//         break;
//     }
//   }
//
// }
var SensorData = /** @class */ (function () {
    function SensorData(port, rawValue, scaledValue, type) {
        this.port = port;
        this.rawValue = rawValue;
        this.scaledValue = scaledValue;
        this.type = type;
    }
    return SensorData;
}());
export { SensorData };
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
