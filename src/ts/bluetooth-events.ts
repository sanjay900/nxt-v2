//TODO: handle bluetooth events and converting them to actions
import BluetoothSerial from "react-native-bluetooth-serial";
import {Store} from "redux";
import {disconnect} from "./actions/bluetooth-actions";
import {TelegramType} from "./nxt-structure/nxt-packet";
import {Packet} from "./nxt-structure/packets/packet";
import {PacketFactory} from "./nxt-structure/packets/packet-factory";
import {Buffer} from "buffer";
import {readPacket} from "./actions/device-actions";

let buffer: number[] = [];
export function initEvents(store: Store) {
    BluetoothSerial.on('bluetoothEnabled', () => {

    });
    BluetoothSerial.on('bluetoothDisabled', () => {

    });
    BluetoothSerial.on('connectionLost', () => {
        store.dispatch(disconnect());
    });
    setInterval(() => {
        BluetoothSerial.readFromDevice().then(data => {
            if (data.length != 0) {
                buffer.push(...Array.from(new Buffer(data, 'base64')));
            }
            if (buffer.length > 0) {
                let len: number = buffer[0] | buffer[1] << 8;
                while (buffer.length >= len + 2) {
                    buffer.splice(0, 2);
                    parsePacket(buffer.splice(0, len), store);
                    len = buffer[0] | buffer[1] << 8;
                }
            }
        });
    });
}
function parsePacket(data: number[], store: Store) {
    let telegramType = data.shift();
    if (telegramType == TelegramType.REPLY) {
        //Look up this packet, and construct it from the available data.
        let packet: Packet | null = PacketFactory.readPacket(data);
        if (packet) {
            store.dispatch(readPacket(packet, packet.id));
            //Emit events inside the angular thread so things update correctly

        }
    }
}