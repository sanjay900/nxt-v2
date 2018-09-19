import {ActionsObservable, StateObservable} from "redux-observable";
import {RootAction, RootState} from "../store";
import {EMPTY, merge, Observable, of} from "rxjs";
import {InputSensorMode, InputSensorType, SensorData, SensorType} from "../nxt-structure/sensor/sensor-constants";
import {catchError, delay, expand, filter, map, share, switchMap} from "rxjs/operators";
import {UltrasonicSensorRegister} from "../nxt-structure/sensor/i2c-register";
import {GetInputValues} from "../nxt-structure/packets/direct/get-input-values";
import {LsWrite} from "../nxt-structure/packets/direct/ls-write";
import {LsGetStatus} from "../nxt-structure/packets/direct/ls-get-status";
import {LsRead} from "../nxt-structure/packets/direct/ls-read";
import {writePacket} from "./device-epics";
import {isActionOf} from "typesafe-actions";
import * as deviceActions from "../actions/device-actions";
import {UltrasonicSensorCommand} from "../nxt-structure/ultrasonic-sensor-command";
import {PacketError, SystemSensor} from "../reducers/device";
import {EmptyPacket} from "../nxt-structure/packets/EmptyPacket";
import {ConnectionStatus} from "../reducers/bluetooth";

const CM_TO_INCH = 0.393700;
export const TYPE_TO_MODE: Map<SensorType, InputSensorMode> = new Map<SensorType, InputSensorMode>([
    [SensorType.SOUND_DB, InputSensorMode.RAW],
    [SensorType.SOUND_DBA, InputSensorMode.RAW],
    [SensorType.LIGHT_ACTIVE, InputSensorMode.RAW],
    [SensorType.LIGHT_INACTIVE, InputSensorMode.RAW],
    [SensorType.TOUCH, InputSensorMode.BOOLEAN],
    [SensorType.ULTRASONIC_INCH, InputSensorMode.RAW],
    [SensorType.ULTRASONIC_CM, InputSensorMode.RAW],
]);
export const TYPE_TO_TYPE: Map<SensorType, InputSensorType> = new Map<SensorType, InputSensorType>([
    [SensorType.SOUND_DB, InputSensorType.SOUND_DB],
    [SensorType.SOUND_DBA, InputSensorType.SOUND_DBA],
    [SensorType.TOUCH, InputSensorType.TOUCH],
    [SensorType.LIGHT_ACTIVE, InputSensorType.LIGHT_ACTIVE],
    [SensorType.LIGHT_INACTIVE, InputSensorType.LIGHT_INACTIVE],
    [SensorType.ULTRASONIC_INCH, InputSensorType.LOW_SPEED_9V],
    [SensorType.ULTRASONIC_CM, InputSensorType.LOW_SPEED_9V],
]);

function readI2CRegister(register: number, port: number): Observable<SensorData> {
    return writePacket(LsWrite.createPacket(port, [0x02, register], 1)).pipe(
        () => writePacket(LsGetStatus.createPacket(port)),
        filter((packet: LsGetStatus) => packet.bytesReady > 0),
        () => writePacket(LsRead.createPacket(port)),
        map(packet => ({rawValue: packet.rxData[0], scaledValue: packet.rxData[0], port: port}))
    )
}

export function tickSensor(port: number, state$: StateObservable<RootState>): Observable<SensorData> {
    let sensor = state$.value.device.inputs[port];
    let pipe = of(state$.value.device.outputConfig).pipe(
        filter(() => sensor.type != SensorType.NONE),
        share()
    );
    return merge(
        pipe.pipe(
            filter(() => sensor.type == SensorType.ULTRASONIC_CM || sensor.type == SensorType.ULTRASONIC_INCH),
            () => readI2CRegister(UltrasonicSensorRegister.MEASUREMENT_BYTE_0, port),
            map(data => {
                let scale = sensor.type == SensorType.ULTRASONIC_INCH ? CM_TO_INCH : 1;
                return {scaledValue: data.scaledValue * scale, rawValue: data.rawValue, port: port}
            })
        ),
        pipe.pipe(
            filter(() => sensor.type != SensorType.ULTRASONIC_CM && sensor.type != SensorType.ULTRASONIC_INCH),
            () => writePacket(GetInputValues.createPacket(port)),
            map(packet => ({rawValue: packet.rawValue, scaledValue: packet.scaledValue, port: port}))
        )
    )
}

export const sensorConfig = (action$: ActionsObservable<RootAction>) =>
    action$.pipe(
        filter(isActionOf(deviceActions.sensorConfig.request)),
        switchMap(({payload: config}: { payload: { port: number, type: SensorType } }) => {
            if (config.type == SensorType.ULTRASONIC_CM || config.type == SensorType.ULTRASONIC_INCH) {
                return writePacket(LsWrite.createPacket(config.port, [0x02, UltrasonicSensorRegister.COMMAND, UltrasonicSensorCommand.CONTINUOUS_MEASUREMENT], 0)).pipe(map(() => config))
            }
            return of(config);
        }),
        map(config => {
            let sensor: SystemSensor = {
                type: config.type,
                systemType: TYPE_TO_TYPE.get(config.type)!,
                mode: TYPE_TO_MODE.get(config.type)!,
                data: {
                    rawValue: 0,
                    scaledValue: 0,
                    port: config.port
                },
                dataHistory: []
            };
            deviceActions.sensorConfig.success({sensor, port: config.port});
        }),
        catchError((err: PacketError) => of(deviceActions.startMotorHandler.failure(err))),
        catchError((err: Error) => of(deviceActions.startMotorHandler.failure({
            error: err,
            packet: EmptyPacket.createPacket()
        }))),
    );
export const sensorHandler = (action$: ActionsObservable<RootAction>, state$: StateObservable<RootState>) =>
    action$.pipe(
        filter(isActionOf(deviceActions.sensorHandler.request)),
        map(() => state$.value.device.outputConfig),
        expand(() => {
            let state = state$.value;
            if (state.bluetooth.status == ConnectionStatus.DISCONNECTED) {
                return EMPTY;
            }
            return merge(
                tickSensor(1, state$),
                tickSensor(2, state$),
                tickSensor(3, state$),
                tickSensor(4, state$)
            ).pipe(delay(100));
        }),
        map(deviceActions.sensorUpdate),
        catchError((err: PacketError) => of(deviceActions.startMotorHandler.failure(err))),
        catchError((err: Error) => of(deviceActions.startMotorHandler.failure({
            error: err,
            packet: EmptyPacket.createPacket()
        }))),
    );