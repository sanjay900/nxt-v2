import {SystemPacket} from "./system-packet";
import {NXTFile} from "../../nxt-file";
import {SystemCommand} from "../system-command";
import {Packet} from "../packet";

export class Delete extends SystemPacket {
  public file: NXTFile;

  constructor() {
    super(SystemCommand.DELETE);
  }

  public static createPacket(file: NXTFile) {
    let packet = new Delete();
    packet.file = file;
    return packet;
  }

  readPacket(data: number[]): void {
    super.readPacket(data);
  }

  protected writePacketData(expectResponse: boolean, data: number[]): void {
    super.writePacketData(expectResponse, data);
    Packet.writeFileName(this.file.name, data);
  }
}
