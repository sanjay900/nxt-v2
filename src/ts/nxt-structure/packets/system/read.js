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
import { SystemPacket } from "./system-packet";
import { SystemCommand } from "../system-command";
import { Packet } from "../packet";
import { NXTFile } from "../../nxt-file";
var Read = /** @class */ (function (_super) {
    __extends(Read, _super);
    function Read() {
        return _super.call(this, SystemCommand.READ) || this;
    }
    Read.createPacket = function (file) {
        var packet = new Read();
        packet.file = file;
        return packet;
    };
    Read.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        var length = Packet.readUWord(data);
        this.file.readData(data.splice(0, length));
    };
    Read.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        Packet.writeFileName(this.file.name, data);
        data.push(this.file.handle);
        Packet.writeWord(NXTFile.PACKET_SIZE, data);
    };
    return Read;
}(SystemPacket));
export { Read };
