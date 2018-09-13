import {Packet} from "./packets/packet";


/**
 * This provide handles communication with a NXT device, and provides helper methods for uploading files and NXT I/O.
 */
export class NxtPacketProvider {
    writePacket(expectResponse: boolean, ...packets: Packet[]) {
        for (let packet of packets) {
            // this.bluetooth.write(new Uint8Array(packet.writePacket(expectResponse)));
        }
    }
}

export enum TelegramType {
    DIRECT_COMMAND_RESPONSE = 0x00,
    SYSTEM_COMMAND_RESPONSE = 0x01,
    REPLY = 0x02,
    DIRECT_COMMAND_NO_RESPONSE = 0x80,
    SYSTEM_COMMAND_NO_RESPONSE = 0x81
}
