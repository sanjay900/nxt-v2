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
import { Packet } from "../packet";
import { SystemCommand } from "../system-command";
var FindFirst = /** @class */ (function (_super) {
    __extends(FindFirst, _super);
    function FindFirst() {
        return _super.call(this, SystemCommand.FIND_FIRST) || this;
    }
    FindFirst.createPacket = function (search) {
        var packet = new FindFirst();
        packet.search = search;
        return packet;
    };
    FindFirst.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.handle = data.shift();
        this.fileName = Packet.readAsciiz(data, Packet.FILE_NAME_LENGTH);
        this.fileSize = Packet.readLong(data);
    };
    FindFirst.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        Packet.writeFileName(this.search, data);
    };
    return FindFirst;
}(SystemPacket));
export { FindFirst };
