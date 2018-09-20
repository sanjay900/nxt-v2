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
var LsGetStatus = /** @class */ (function (_super) {
    __extends(LsGetStatus, _super);
    function LsGetStatus() {
        return _super.call(this, DirectCommand.LS_GET_STATUS) || this;
    }
    LsGetStatus.createPacket = function (port) {
        var packet = new LsGetStatus();
        packet.port = port - 1;
        return packet;
    };
    LsGetStatus.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.bytesReady = data.shift();
    };
    LsGetStatus.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.port);
    };
    return LsGetStatus;
}(DirectPacket));
export { LsGetStatus };
