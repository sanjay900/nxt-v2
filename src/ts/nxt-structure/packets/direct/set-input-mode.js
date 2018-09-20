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
import { DirectPacket } from "./direct-packet";
import { DirectCommand } from "../direct-command";
var SetInputMode = /** @class */ (function (_super) {
    __extends(SetInputMode, _super);
    function SetInputMode() {
        return _super.call(this, DirectCommand.SET_INPUT_MODE) || this;
    }
    SetInputMode.createPacket = function (port, type, mode) {
        var packet = new SetInputMode();
        packet.port = port - 1;
        packet.type = type;
        packet.mode = mode;
        return packet;
    };
    SetInputMode.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.port, this.type, this.mode);
    };
    return SetInputMode;
}(DirectPacket));
export { SetInputMode };
