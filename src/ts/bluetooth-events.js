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
import BluetoothSerial from "react-native-bluetooth-serial";
import { disconnect } from "./actions/bluetooth-actions";
import { TelegramType } from "./nxt-structure/packets/packet";
import { Buffer } from "buffer";
import { readPacket } from "./actions/device-actions";
import { SystemCommandResponse } from "./nxt-structure/packets/system-command-response";
import { DirectCommandResponse } from "./nxt-structure/packets/direct-command-response";
import { SystemCommand } from "./nxt-structure/packets/system-command";
import { DirectCommand } from "./nxt-structure/packets/direct-command";
var buffer = [];
export var packetBuffer = [];
export function initEvents(store) {
    BluetoothSerial.on('bluetoothEnabled', function () {
    });
    BluetoothSerial.on('bluetoothDisabled', function () {
    });
    BluetoothSerial.on('connectionLost', function () {
        store.dispatch(disconnect());
    });
    setInterval(function () {
        BluetoothSerial.readFromDevice().then(function (data) {
            if (data.length != 0) {
                buffer.push.apply(buffer, __spread(Array.from(new Buffer(data, 'base64'))));
            }
            if (buffer.length > 0) {
                var len = buffer[0] | buffer[1] << 8;
                while (buffer.length >= len + 2) {
                    buffer.splice(0, 2);
                    parsePacket(buffer.splice(0, len), store);
                    len = buffer[0] | buffer[1] << 8;
                }
            }
        });
    });
}
function parsePacket(data, store) {
    var telegramType = data.shift();
    if (telegramType == TelegramType.REPLY) {
        //What we do here, is since it is a reply, we look for the packet that is being replied to, and
        //then update that packet with the response. We then check the status, and throw errors if required.
        var packetIndex = packetBuffer.findIndex(function (p) { return p.packetMatches(data); });
        if (packetIndex != -1) {
            //discard the id, we matched it above anyways
            data.shift();
            var packet = packetBuffer.splice(packetIndex, 1)[0];
            packet.readPacket(data);
            store.dispatch(readPacket(packet, packet.id));
            console.log([SystemCommand[packet.id], DirectCommand[packet.id], packet.status]);
            if (packet.status != 0) {
                if (SystemCommandResponse[packet.status]) {
                    packet.responseReceived.error({ error: new Error(SystemCommandResponse[packet.status]), packet: packet });
                }
                else {
                    packet.responseReceived.error({ error: new Error(DirectCommandResponse[packet.status]), packet: packet });
                }
            }
            else {
                packet.responseReceived.next(packet);
            }
        }
        else {
            console.log(data);
            console.log(packetBuffer.map(function (packet) { return [SystemCommand[packet.id], DirectCommand[packet.id]]; }));
        }
    }
}
