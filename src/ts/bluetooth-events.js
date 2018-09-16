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
//TODO: handle bluetooth events and converting them to actions
import BluetoothSerial from "react-native-bluetooth-serial";
import { disconnect } from "./actions/bluetooth-actions";
import { TelegramType } from "./nxt-structure/nxt-packet";
import { Buffer } from "buffer";
import { readPacket } from "./actions/device-actions";
import { SystemCommandResponse } from "./nxt-structure/packets/system-command-response";
import { DirectCommandResponse } from "./nxt-structure/packets/direct-command-response";
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
        var messageType_1 = data.shift();
        var packetIndex = packetBuffer.findIndex(function (p) { return p.id == messageType_1; });
        if (packetIndex != -1) {
            var packet = packetBuffer.splice(packetIndex, 1)[0];
            packet.readPacket(data);
            store.dispatch(readPacket(packet, packet.id));
            if (packet.status != 0) {
                if (SystemCommandResponse[packet.status]) {
                    packet.responseRecieved.error(SystemCommandResponse[packet.status]);
                }
                else {
                    packet.responseRecieved.error(DirectCommandResponse[packet.status]);
                }
            }
            else {
                packet.responseRecieved.next(packet);
            }
        }
    }
}
