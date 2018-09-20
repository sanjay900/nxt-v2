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
var LsRead = /** @class */ (function (_super) {
    __extends(LsRead, _super);
    function LsRead() {
        return _super.call(this, DirectCommand.LS_READ) || this;
    }
    LsRead.createPacket = function (port) {
        var packet = new LsRead();
        packet.port = port - 1;
        return packet;
    };
    LsRead.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.bytesRead = data.shift();
        this.rxData = data;
    };
    LsRead.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.port);
    };
    return LsRead;
}(DirectPacket));
export { LsRead };
