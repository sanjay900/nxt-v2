import {DirectCommand} from "../direct-command";
import {DirectPacket} from "./direct-packet";

export class LsRead extends DirectPacket {
    public bytesRead: number;
    public rxData: number[];
    private port: number;

    constructor() {
        super(DirectCommand.LS_READ);
    }

    public static createPacket(port: number) {
        let packet: LsRead = new LsRead();
        packet.port = port - 1;
        return packet;
    }

    readPacket(data: number[]): void {
        super.readPacket(data);
        this.bytesRead = data.shift()!;
        this.rxData = data;
    }

    protected writePacketData(expectResponse: boolean, data: number[]): void {
        super.writePacketData(expectResponse, data);
        data.push(this.port);
    }
}
