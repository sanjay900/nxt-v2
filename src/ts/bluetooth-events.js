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
import { PacketFactory } from "./nxt-structure/packets/packet-factory";
import { Buffer } from "buffer";
import { readPacket } from "./actions/device-actions";
var buffer = [];
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
        //Look up this packet, and construct it from the available data.
        var packet = PacketFactory.readPacket(data);
        if (packet) {
            store.dispatch(readPacket(packet, packet.id));
            //Emit events inside the angular thread so things update correctly
        }
    }
}
