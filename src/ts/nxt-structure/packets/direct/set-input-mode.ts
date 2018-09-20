import {InputSensorMode, InputSensorType} from "../../sensor-constants";
import {DirectPacket} from "./direct-packet";
import {DirectCommand} from "../direct-command";

export class SetInputMode extends DirectPacket {
    private port: number;
    private type: InputSensorType;
    private mode: InputSensorMode;

    constructor() {
        super(DirectCommand.SET_INPUT_MODE);
    }

    public static createPacket(port: number, type: InputSensorType, mode: InputSensorMode) {
        let packet: SetInputMode = new SetInputMode();
        packet.port = port - 1;
        packet.type = type;
        packet.mode = mode;
        return packet;
    }

    protected writePacketData(expectResponse: boolean, data: number[]): void {
        super.writePacketData(expectResponse, data);
        data.push(this.port, this.type, this.mode);
    }
}
