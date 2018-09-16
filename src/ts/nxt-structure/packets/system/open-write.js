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
import { NXTFileMode, NXTFileState } from "../../nxt-file";
import { SystemCommand } from "../system-command";
import { SystemCommandResponse } from "../system-command-response";
var OpenWrite = /** @class */ (function (_super) {
    __extends(OpenWrite, _super);
    function OpenWrite() {
        return _super.call(this, SystemCommand.OPEN_WRITE) || this;
    }
    OpenWrite.createPacket = function (file) {
        var packet = new OpenWrite();
        packet.file = file;
        return packet;
    };
    OpenWrite.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        if (this.status == SystemCommandResponse.FILE_ALREADY_EXISTS) {
            this.file.status = NXTFileState.FILE_EXISTS;
        }
        else if (this.status != SystemCommandResponse.SUCCESS) {
            this.file.status = NXTFileState.ERROR;
        }
    };
    OpenWrite.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        Packet.writeFileName(this.file.name, data);
        Packet.writeLong(this.file.size, data);
        this.file.mode = NXTFileMode.WRITE;
        this.file.status = NXTFileState.OPENING;
    };
    return OpenWrite;
}(SystemPacket));
export { OpenWrite };
