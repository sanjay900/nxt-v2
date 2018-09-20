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
import { DirectCommand } from "../direct-command";
import { DirectPacket } from "./direct-packet";
var ResetInputScaledValue = /** @class */ (function (_super) {
    __extends(ResetInputScaledValue, _super);
    function ResetInputScaledValue() {
        return _super.call(this, DirectCommand.RESET_INPUT_SCALED_VALUE) || this;
    }
    ResetInputScaledValue.createPacket = function (port) {
        var packet = new ResetInputScaledValue();
        packet.port = port - 1;
        return packet;
    };
    ResetInputScaledValue.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.port);
    };
    return ResetInputScaledValue;
}(DirectPacket));
export { ResetInputScaledValue };
