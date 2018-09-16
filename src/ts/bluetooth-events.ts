//TODO: handle bluetooth events and converting them to actions
import BluetoothSerial from "react-native-bluetooth-serial";
import {Store} from "redux";
import {disconnect} from "./actions/bluetooth-actions";
import {TelegramType} from "./nxt-structure/nxt-packet";
import {Packet} from "./nxt-structure/packets/packet";
import {PacketFactory} from "./nxt-structure/packets/packet-factory";
import {Buffer} from "buffer";
import {readPacket} from "./actions/device-actions";
import {RootState} from "./store";
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
    let {packetsSent} = store.getState().device;
    let packet: Packet = packetsSent.find(packet => packet.id == messageType);
    if (packet) {
      packet.readPacket(data);
      store.dispatch(readPacket(packet, packet.id));
      if (packet.status != DirectCommandResponse.SUCCESS) {
        packet.responseRecieved.error(packet.status)
      } else {
        packet.responseRecieved.next(packet);
      }
    }
  }
}