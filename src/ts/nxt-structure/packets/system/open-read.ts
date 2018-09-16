import {SystemPacket} from "./system-packet";
import {SystemCommand} from "../system-command";
import {Packet} from "../packet";
import {NXTFile, NXTFileMode, NXTFileState} from "../../nxt-file";

export class OpenRead extends SystemPacket {
  public file: NXTFile;

  constructor() {
    super(SystemCommand.OPEN_READ);
  }

  public static createPacket(file: NXTFile) {
    let packet = new OpenRead();
    packet.file = file;
    return packet;
  }

  readPacket(data: number[]): void {
    super.readPacket(data);
    this.file.size = Packet.readLong(data);
  }

  protected writePacketData(expectResponse: boolean, data: number[]): void {
    super.writePacketData(expectResponse, data);
    Packet.writeFileName(this.file.name, data);
    this.file.mode = NXTFileMode.READ;
    this.file.status = NXTFileState.OPENING;
  }
}
