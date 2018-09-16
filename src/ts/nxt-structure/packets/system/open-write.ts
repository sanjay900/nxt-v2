import {SystemPacket} from "./system-packet";
import {Packet} from "../packet";
import {NXTFile, NXTFileMode, NXTFileState} from "../../nxt-file";
import {SystemCommand} from "../system-command";
import {SystemCommandResponse} from "../system-command-response";

export class OpenWrite extends SystemPacket {
  public file: NXTFile;

  constructor() {
    super(SystemCommand.OPEN_WRITE);
  }

  public static createPacket(file: NXTFile) {
    let packet = new OpenWrite();
    packet.file = file;
    return packet;
  }

  readPacket(data: number[]): void {
    super.readPacket(data);
    if (this.status == SystemCommandResponse.FILE_ALREADY_EXISTS) {
      this.file.status = NXTFileState.FILE_EXISTS;
    } else if (this.status != SystemCommandResponse.SUCCESS) {
      this.file.status = NXTFileState.ERROR;
    }
  }

  protected writePacketData(expectResponse: boolean, data: number[]): void {
    super.writePacketData(expectResponse, data);
    Packet.writeFileName(this.file.name, data);
    Packet.writeLong(this.file.size, data);
    this.file.mode = NXTFileMode.WRITE;
    this.file.status = NXTFileState.OPENING;
  }
}
