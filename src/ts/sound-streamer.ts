//This code is a test for a feature that would allow the NXT to function as a garbage bluetooth speaker
//It is currently disabled as it will fill the nxt's free space very quickly, and is very buggy.

import {DeviceEventEmitter, NativeModules, PermissionsAndroid} from "react-native";
import {Buffer} from "buffer";
import {ConnectionStatus, RootState} from "./store";
import {EMPTY, merge, of} from "rxjs";
import {catchError, delay, expand, filter, map, switchMap, take} from "rxjs/operators";
import {NXTFile} from "./nxt-structure/nxt-file";
import {writePacket} from "./epics/device-epics";
import {OpenWrite} from "./nxt-structure/packets/system/open-write";
import {Write} from "./nxt-structure/packets/system/write";
import {Close} from "./nxt-structure/packets/system/close";
import {PlaySoundFile} from "./nxt-structure/packets/direct/play-sound-file";
import {Delete} from "./nxt-structure/packets/system/delete";
import {Store} from "redux";
let abuffer: number[] = [];
function listenToAudio(store: Store<RootState>) {
    //We need permission to record audio
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then(() => {
        //The custom native plugin will send all audio as garbage quality to this function
        DeviceEventEmitter.addListener("audio", data => {
            let audio = Array.from(new Buffer(data, 'base64'));
            if (store.getState().bluetooth.status != ConnectionStatus.CONNECTED) return;
            abuffer.push(...audio);
        });
        let size = 8096;
        of(size).pipe(
            expand(data => {
                return merge(
                    of(data).pipe(
                        filter(() => abuffer.length >= size),
                        switchMap(() => {
                            let saudio = [0x01, 0x00, size, size >> 8, 16000, 16000 >> 8, 0, 0, ...abuffer.splice(0, size)];
                            let file = new NXTFile(`Test${Math.floor(Math.random() * 100)}.rso`, saudio);
                            return writePacket(OpenWrite.createPacket(file));
                        }),
                        map(packet => Write.createPacket(packet.file)),
                        expand((packet: Write) => {
                            if (packet.file.hasWritten()) {
                                return EMPTY;
                            } else {
                                return writePacket(packet);
                            }
                        }),
                        filter(data => data.file.hasWritten()),
                        take(1),
                        switchMap((packet: Write) => writePacket(Close.createPacket(packet.file))),
                        switchMap((packet: Close) => writePacket(PlaySoundFile.createPacket(false, packet.file.name))),
                        switchMap(packet => writePacket(Delete.createPacket(new NXTFile(packet.soundFileName)))),
                        catchError(err => of(err))
                    ),
                    of(data).pipe(
                        filter(() => abuffer.length < size),
                        delay(100)
                    )
                )
            }),
        ).subscribe((s) => console.log(s));
        (NativeModules as any).RNMemes.beginRecording();
    });
}
