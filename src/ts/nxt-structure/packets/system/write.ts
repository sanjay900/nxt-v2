import {SystemPacket} from "./system-packet";
import {NXTFile} from "../../nxt-file";
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
    }

    public packetMatches(data: number[]): boolean {
        return super.packetMatches(data) && data[2] == this.file.handle;
    }

    protected writePacketData(expectResponse: boolean, data: number[]): void {
        super.writePacketData(expectResponse, data);
        data.push(this.file.handle);
        data.push(...this.file.nextChunk());
    }
}
