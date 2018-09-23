//This code is a test for a feature that would allow the NXT to function as a garbage bluetooth speaker
//It is currently disabled as it will fill the nxt's free space very quickly, and is very buggy.
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { DeviceEventEmitter, NativeModules, PermissionsAndroid } from "react-native";
import { Buffer } from "buffer";
import { ConnectionStatus } from "./store";
import { EMPTY, merge, of } from "rxjs";
import { catchError, delay, expand, filter, map, switchMap, take } from "rxjs/operators";
import { NXTFile } from "./nxt-structure/nxt-file";
import { writePacket } from "./epics/device-epics";
import { OpenWrite } from "./nxt-structure/packets/system/open-write";
import { Write } from "./nxt-structure/packets/system/write";
import { Close } from "./nxt-structure/packets/system/close";
import { PlaySoundFile } from "./nxt-structure/packets/direct/play-sound-file";
import { Delete } from "./nxt-structure/packets/system/delete";
var abuffer = [];
var EIGHT_BIT_PCM_CODEC = 0x100;
var IMA_ADPCM_CODEC = 0x101;
function listenToAudio(store) {
    //We need permission to record audio
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO).then(function () {
        //The custom native plugin will send all audio as garbage quality to this function
        DeviceEventEmitter.addListener("audio", function (data) {
            var audio = Array.from(new Buffer(data, 'base64'));
            if (store.getState().bluetooth.status != ConnectionStatus.CONNECTED)
                return;
            abuffer.push.apply(abuffer, __spread(audio));
        });
        var size = 8096;
        var sampleRate = 16000;
        var codec = EIGHT_BIT_PCM_CODEC;
        var loop = 0; //We do not want to loop
        of(size).pipe(expand(function (data) {
            return merge(of(data).pipe(filter(function () { return abuffer.length >= size; }), switchMap(function () {
                //Prepend the pcm data with the RSO header (https://wiki.multimedia.cx/index.php?title=RSO)
                var audio_data = __spread([codec, codec >> 8, size, size >> 8, sampleRate, sampleRate >> 8, loop, loop >> 8], abuffer.splice(0, size));
                var file = new NXTFile("Test" + Math.floor(Math.random() * 100) + ".rso", audio_data);
                return writePacket(OpenWrite.createPacket(file));
            }), map(function (packet) { return Write.createPacket(packet.file); }), expand(function (packet) {
                if (packet.file.hasWritten()) {
                    return EMPTY;
                }
                else {
                    return writePacket(packet);
                }
            }), filter(function (data) { return data.file.hasWritten(); }), take(1), switchMap(function (packet) { return writePacket(Close.createPacket(packet.file)); }), switchMap(function (packet) { return writePacket(PlaySoundFile.createPacket(false, packet.file.name)); }), switchMap(function (packet) { return writePacket(Delete.createPacket(new NXTFile(packet.soundFileName))); }), catchError(of)), of(data).pipe(filter(function () { return abuffer.length < size; }), delay(100)));
        })).subscribe(ignore);
        NativeModules.RNMemes.beginRecording();
    });
}
function ignore() { }
