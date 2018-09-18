import BluetoothSerial from "react-native-bluetooth-serial";
import {Store} from "redux";
import {disconnect} from "./actions/bluetooth-actions";
import {TelegramType} from "./nxt-structure/nxt-packet";
import {Packet} from "./nxt-structure/packets/packet";
import {Buffer} from "buffer";
import {readPacket} from "./actions/device-actions";
import {RootState} from "./store";
import {SystemCommandResponse} from "./nxt-structure/packets/system-command-response";
import {DirectCommandResponse} from "./nxt-structure/packets/direct-command-response";

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

function parsePacket(data: number[], store: Store<RootState>) {
    let telegramType = data.shift();
    if (telegramType == TelegramType.REPLY) {
        //What we do here, is since it is a reply, we look for the packet that is being replied to, and
        //then update that packet with the response. We then check the status, and throw errors if required.
        let messageType: number = data.shift()!;
        let packetIndex: number = store.getState().device.packetBuffer.findIndex(p => p.id == messageType);
        if (packetIndex != -1) {
            let packet: Packet = store.getState().device.packetBuffer.splice(packetIndex, 1)[0];
            packet.readPacket(data);
            store.dispatch(readPacket(packet, packet.id));
            if (packet.status != 0) {
                if (SystemCommandResponse[packet.status]) {
                    packet.responseReceived.error({error: new Error(SystemCommandResponse[packet.status]), packet});
                } else {
                    packet.responseReceived.error({error: new Error(DirectCommandResponse[packet.status]), packet});
                }
            } else {
                packet.responseReceived.next(packet);
            }
        }
    }
}