import {Packet} from "./packet";

export class EmptyPacket extends Packet {

    protected constructor() {
        super(0)
    }

    public static createPacket() {
        return new EmptyPacket();
    }

    protected writePacketData(expectResponse: boolean, data: number[]): void {

    }
}
