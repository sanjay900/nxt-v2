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
import { NXTFileMode, NXTFileState } from "../../nxt-file";
var OpenRead = /** @class */ (function (_super) {
    __extends(OpenRead, _super);
    function OpenRead() {
        return _super.call(this, SystemCommand.OPEN_READ) || this;
    }
    OpenRead.createPacket = function (file) {
        var packet = new OpenRead();
        packet.file = file;
        return packet;
    };
    OpenRead.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.file.size = Packet.readLong(data);
    };
    OpenRead.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        Packet.writeFileName(this.file.name, data);
        this.file.mode = NXTFileMode.READ;
        this.file.status = NXTFileState.OPENING;
    };
    return OpenRead;
}(SystemPacket));
export { OpenRead };
