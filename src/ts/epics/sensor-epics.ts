import {ActionsObservable, StateObservable} from "redux-observable";
import {ConnectionStatus, RootAction, RootState, SystemSensor} from "../store";
import {EMPTY, merge, Observable, of} from "rxjs";
import {InputSensorMode, InputSensorType, SensorData, SensorType} from "../nxt-structure/sensor-constants";
import {catchError, delay, expand, filter, map, share, switchMap} from "rxjs/operators";
import {UltrasonicSensorRegister} from "../nxt-structure/i2c-register";
import {GetInputValues} from "../nxt-structure/packets/direct/get-input-values";
import {LsWrite} from "../nxt-structure/packets/direct/ls-write";
import {LsGetStatus} from "../nxt-structure/packets/direct/ls-get-status";
import {LsRead} from "../nxt-structure/packets/direct/ls-read";
import {writePacket} from "./device-epics";
import {isActionOf} from "typesafe-actions";
import * as sensorActions from "../actions/sensor-actions";
import {UltrasonicSensorCommand} from "../nxt-structure/ultrasonic-sensor-command";
import {initialSensor, PacketError} from "../reducers/device";
import {EmptyPacket} from "../nxt-structure/packets/empty-packet";
import {SetInputMode} from "../nxt-structure/packets/direct/set-input-mode";

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

function writeConfigPacket(config: { port: number, sensorType: SensorType }) {
    let sensor: SystemSensor = {
        type: config.sensorType,
        systemType: TYPE_TO_TYPE.get(config.sensorType)!,
        mode: TYPE_TO_MODE.get(config.sensorType)!,
        data: {
            rawValue: 0,
            scaledValue: 0,
            port: config.port
        },
        dataHistory: [],
        enabled: true
    };
    return writePacket(SetInputMode.createPacket(config.port, sensor.systemType, sensor.mode)).pipe(map(() => ({
        port: config.port,
        sensorType: sensor
    })));
}

export const sensorConfig = (action$: ActionsObservable<RootAction>) =>
    action$.pipe(
        filter(isActionOf(sensorActions.sensorConfig.request)),
        switchMap(({payload: config}: { payload: { port: number, sensorType: SensorType } }) => {
            return of(config);
        }),
        switchMap(writeConfigPacket),
        switchMap(config => {
            if (config.sensorType.type == SensorType.ULTRASONIC_CM || config.sensorType.type == SensorType.ULTRASONIC_INCH) {
                return writePacket(
                    LsWrite.createPacket(
                        config.port,
                        [0x02, UltrasonicSensorRegister.COMMAND, UltrasonicSensorCommand.CONTINUOUS_MEASUREMENT],
                        0)).pipe(map(() => config)
                )
            } else {
                return of(config)
            }
        }),
        map(sensorActions.sensorConfig.success),
        catchError((err: PacketError) => of(sensorActions.sensorConfig.failure(err))),
        catchError((err: Error) => of(sensorActions.sensorConfig.failure({
            error: err,
            packet: EmptyPacket.createPacket()
        }))),
    );
export const sensorHandler = (action$: ActionsObservable<RootAction>, state$: StateObservable<RootState>) =>
    action$.pipe(
        filter(isActionOf(sensorActions.sensorHandler.request)),
        switchMap(() => [1, 2, 3, 4]),
        map(port => ({port, sensorType: state$.value.device.inputs[port].type})),
        switchMap((port)=>writeConfigPacket(port).pipe(map(({port})=>initialSensor(port).data))),
        expand(port => {
            let state = state$.value;
            if (state.bluetooth.status == ConnectionStatus.DISCONNECTED) {
                return EMPTY;
            }
            return of(port).pipe(
                delay(0),
                switchMap(() => tickSensor(port.port, state$)),
                catchError(() => {
                        //Digital sensors return errors to tell you you cannot read from them, so instead of passing those errors to the user,
                        //its better to silence them and not return data
                        return of({rawValue: -1, scaledValue: -1, port: port.port});
                    }
                )
            );
        }),
        filter(data => data.rawValue >= 0),
        //Unwrap the observable returned by tickSensor
        map(sensorActions.sensorUpdate),
        catchError((err: PacketError) => of(sensorActions.sensorHandler.failure(err))),
        catchError((err: Error) => of(sensorActions.sensorHandler.failure({
            error: err,
            packet: EmptyPacket.createPacket()
        }))),
    );


function readI2CRegister(register: number, port: number): Observable<SensorData> {
    let p = of(port).pipe(
        switchMap(() => writePacket(LsWrite.createPacket(port, [0x02, register], 1))),
        switchMap(() => writePacket(LsGetStatus.createPacket(port))),
        share()
    );
    return merge(
        p.pipe(
            filter(packet => packet.bytesReady > 0),
            switchMap(() => writePacket(LsRead.createPacket(port))),
            map(packet => ({rawValue: packet.rxData[0], scaledValue: packet.rxData[0], port: port}))
        ),
        p.pipe(
            filter(packet => packet.bytesReady == 0),
            //If the sensor isnt ready, we can just ignore its data
            map(() => ({rawValue: -1, scaledValue: -1, port: port}))
        ),
    );
}

function isUltrasonic(type: SensorType) {
    return type == SensorType.ULTRASONIC_INCH || type == SensorType.ULTRASONIC_CM;
}

export function tickSensor(port: number, state$: StateObservable<RootState>) {
    let p = of(state$.value.device.inputs[port]).pipe(share());
    //Merge together the possibilities for each type of sensor tick
    return merge(
        p.pipe(
            filter(sensor => sensor.type == SensorType.NONE || !sensor.enabled),
            map(() => ({rawValue: -1, scaledValue: -1, port: port}))
        ),
        p.pipe(
            filter(sensor => isUltrasonic(sensor.type) && sensor.enabled),
            switchMap(() => readI2CRegister(UltrasonicSensorRegister.MEASUREMENT_BYTE_0, port)),
            map(data => {
                let scale = state$.value.device.inputs[port].type == SensorType.ULTRASONIC_INCH ? CM_TO_INCH : 1;
                return {scaledValue: data.scaledValue * scale, rawValue: data.rawValue, port: port}
            })
        ),
        p.pipe(
            filter(sensor => sensor.type != SensorType.NONE && !isUltrasonic(sensor.type) && sensor.enabled),
            switchMap(() => writePacket(GetInputValues.createPacket(port))),
            map(packet => ({
                rawValue: packet.rawValue,
                scaledValue: packet.scaledValue,
                port: port
            })),
        )
    )
        ;
}
