import BluetoothSerial from "react-native-bluetooth-serial";
import {Store} from "redux";
import {disconnect} from "./actions/bluetooth-actions";
import {Packet, TelegramType} from "./nxt-structure/packets/packet";
import {Buffer} from "buffer";
import {readPacket} from "./actions/device-actions";
import {RootState} from "./store";
import {SystemCommandResponse} from "./nxt-structure/packets/system-command-response";
import {DirectCommandResponse} from "./nxt-structure/packets/direct-command-response";
import {SystemCommand} from "./nxt-structure/packets/system-command";
import {DirectCommand} from "./nxt-structure/packets/direct-command";

let buffer: number[] = [];
export let packetBuffer: Packet[] = [];

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
        let packetIndex: number = packetBuffer.findIndex(p => p.packetMatches(data));
        if (packetIndex != -1) {
            //discard the id, we matched it above anyways
            data.shift();
            let packet: Packet = packetBuffer.splice(packetIndex, 1)[0];
            packet.readPacket(data);
            store.dispatch(readPacket(packet, packet.id));
            console.log([SystemCommand[packet.id], DirectCommand[packet.id], packet.status]);
            if (packet.status != 0) {
                if (SystemCommandResponse[packet.status]) {
                    packet.responseReceived.error({error: new Error(SystemCommandResponse[packet.status]), packet});
                } else {
                    packet.responseReceived.error({error: new Error(DirectCommandResponse[packet.status]), packet});
                }
            } else {
                packet.responseReceived.next(packet);
            }
        } else {
            console.log(data);
            console.log(packetBuffer.map(packet=>[SystemCommand[packet.id], DirectCommand[packet.id]]));
        }
    }
}