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
var MessageRead = /** @class */ (function (_super) {
    __extends(MessageRead, _super);
    function MessageRead() {
        return _super.call(this, DirectCommand.MESSAGE_READ) || this;
    }
    MessageRead.createPacket = function (localInbox, remoteInbox, removeFromDevice) {
        var packet = new MessageRead();
        packet.localInbox = localInbox;
        packet.remoteInbox = remoteInbox;
        packet.removeFromDevice = removeFromDevice;
        return packet;
    };
    MessageRead.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.localInbox = data.shift();
        var messageSize = data.shift();
        this.message = Packet.readAsciiz(data, MessageRead.MESSAGE_LENGTH);
        this.message = this.message.substring(0, messageSize);
    };
    MessageRead.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.remoteInbox, this.localInbox);
        Packet.writeBoolean(this.removeFromDevice, data);
    };
    MessageRead.MESSAGE_LENGTH = 58;
    return MessageRead;
}(DirectPacket));
export { MessageRead };
