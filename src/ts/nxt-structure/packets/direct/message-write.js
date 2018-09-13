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
import { Packet } from "../packet";
import { DirectCommand } from "../direct-command";
import { DirectPacket } from "./direct-packet";
var MessageWrite = /** @class */ (function (_super) {
    __extends(MessageWrite, _super);
    function MessageWrite() {
        return _super.call(this, DirectCommand.MESSAGE_WRITE) || this;
    }
    MessageWrite.createPacket = function (inbox, message) {
        var packet = new MessageWrite();
        packet.inbox = inbox;
        packet.message = message;
        return packet;
    };
    MessageWrite.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        //null terminator
        data.push(this.inbox, this.message.length + 1);
        Packet.writeAsciiz(this.message, data);
    };
    return MessageWrite;
}(DirectPacket));
export { MessageWrite };
