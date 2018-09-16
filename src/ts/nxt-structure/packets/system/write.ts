import {SystemPacket} from "./system-packet";
import {SystemCommandResponse} from "../system-command-response";
import {NXTFile, NXTFileState} from "../../nxt-file";
import {SystemCommand} from "../system-command";

export class Write extends SystemPacket {
  public file: NXTFile;

  constructor() {
    super(SystemCommand.WRITE);
  }

  public static createPacket(file: NXTFile) {
    let packet = new Write();
    packet.file = file;
    return packet;
  }

  readPacket(data: number[]): void {
    super.readPacket(data);
    //TODO: we should technically handle this, but i also really do not care
    let handle: number = data.shift();
    if (this.status != SystemCommandResponse.SUCCESS) {
      this.file.status = NXTFileState.ERROR;
    }
    this.file.response = this.status;
  }

  protected writePacketData(expectResponse: boolean, data: number[]): void {
    super.writePacketData(expectResponse, data);
    data.push(this.file.handle);
    data.push(...this.file.nextChunk());
    this.file.status = NXTFileState.WRITING;
  }
}
