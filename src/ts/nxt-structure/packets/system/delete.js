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
import { NXTFileState } from "../../nxt-file";
import { SystemCommand } from "../system-command";
import { Packet } from "../packet";
import { SystemCommandResponse } from "../system-command-response";
var Delete = /** @class */ (function (_super) {
    __extends(Delete, _super);
    function Delete() {
        return _super.call(this, SystemCommand.DELETE) || this;
    }
    Delete.createPacket = function (file) {
        var packet = new Delete();
        packet.file = file;
        return packet;
    };
    Delete.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.file = SystemPacket.filesByName[Packet.readAsciiz(data, Packet.FILE_NAME_LENGTH)];
        this.file.response = this.status;
        if (this.status == SystemCommandResponse.SUCCESS) {
            this.file.status = NXTFileState.DELETED;
        }
        else {
            this.file.status = NXTFileState.ERROR;
        }
    };
    Delete.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        Packet.writeFileName(this.file.name, data);
    };
    return Delete;
}(SystemPacket));
export { Delete };
