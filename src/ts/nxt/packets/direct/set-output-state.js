var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Packet } from "../packet";
import { DirectPacket } from "./direct-packet";
import { DirectCommand } from "../direct-command";
var SetOutputState = /** @class */ (function (_super) {
    __extends(SetOutputState, _super);
    function SetOutputState() {
        return _super.call(this, DirectCommand.SET_OUTPUT_STATE) || this;
    }
    SetOutputState.createPacket = function (port, power, mode, regulationMode, turnRatio, runState, tachoLimit) {
        var packet = new SetOutputState();
        packet.port = port;
        packet.power = power;
        packet.mode = mode;
        packet.regulationMode = regulationMode;
        packet.turnRatio = turnRatio;
        packet.runState = runState;
        packet.tachoLimit = tachoLimit;
        return packet;
    };
    SetOutputState.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.port, this.power, this.mode, this.regulationMode, this.turnRatio, this.runState);
        Packet.writeLong(this.tachoLimit, data);
    };
    return SetOutputState;
}(DirectPacket));
export { SetOutputState };
