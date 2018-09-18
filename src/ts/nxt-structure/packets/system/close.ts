import {SystemPacket} from "./system-packet";
import {NXTFile} from "../../nxt-file";
import {SystemCommand} from "../system-command";

export class Close extends SystemPacket {
    public file: NXTFile;

    constructor() {
        super(SystemCommand.CLOSE);
    }

    public static createPacket(file: NXTFile) {
        let packet = new Close();
        packet.file = file;
        return packet;
    }

    readPacket(data: number[]): void {
        super.readPacket(data);
    }

    protected writePacketData(expectResponse: boolean, data: number[]): void {
        super.writePacketData(expectResponse, data);
        data.push(this.file.handle);
    }
}
