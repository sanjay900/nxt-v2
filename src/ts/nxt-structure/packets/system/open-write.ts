import {SystemPacket} from "./system-packet";
import {Packet} from "../packet";
import {NXTFile, NXTFileMode} from "../../nxt-file";
import {SystemCommand} from "../system-command";

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
    }

    protected writePacketData(expectResponse: boolean, data: number[]): void {
        super.writePacketData(expectResponse, data);
        Packet.writeFileName(this.file.name, data);
        Packet.writeLong(this.file.size, data);
        this.file.mode = NXTFileMode.WRITE;
    }
}
