import {Packet, TelegramType} from "../packet";

export abstract class SystemPacket extends Packet {
  protected writePacketData(expectResponse: boolean, data: number[]) {
    data.push(expectResponse ? TelegramType.SYSTEM_COMMAND_RESPONSE : TelegramType.SYSTEM_COMMAND_NO_RESPONSE);
    data.push(this.id);
  }
}
