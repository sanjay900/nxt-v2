import {DirectCommand} from "../direct-command";
import {DirectPacket} from "./direct-packet";

export class ResetInputScaledValue extends DirectPacket {
  private port: number;

  constructor() {
    super(DirectCommand.RESET_INPUT_SCALED_VALUE);
  }

  public static createPacket(port: number) {
    let packet: ResetInputScaledValue = new ResetInputScaledValue();
    packet.port = port-1;
    return packet;
  }

  protected writePacketData(expectResponse: boolean, data: number[]): void {
    super.writePacketData(expectResponse, data);
    data.push(this.port);
  }
}
