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
import { SystemCommandResponse } from "../system-command-response";
var Close = /** @class */ (function (_super) {
    __extends(Close, _super);
    function Close() {
        return _super.call(this, SystemCommand.CLOSE) || this;
    }
    Close.createPacket = function (file) {
        var packet = new Close();
        packet.file = file;
        return packet;
    };
    Close.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.file = SystemPacket.filesByHandle[data.shift()];
        this.file.response = this.status;
        if (this.status != SystemCommandResponse.SUCCESS) {
            this.file.status = NXTFileState.ERROR;
        }
        else {
            this.file.status = NXTFileState.WRITTEN;
        }
    };
    Close.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.file.handle);
        this.file.status = NXTFileState.CLOSING;
    };
    return Close;
}(SystemPacket));
export { Close };
