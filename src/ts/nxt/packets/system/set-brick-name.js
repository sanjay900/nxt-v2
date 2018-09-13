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
var SetBrickName = /** @class */ (function (_super) {
    __extends(SetBrickName, _super);
    function SetBrickName() {
        return _super.call(this, SystemCommand.SET_BRICK_NAME) || this;
    }
    SetBrickName.createPacket = function (name) {
        var packet = new SetBrickName();
        packet.name = name;
        return packet;
    };
    SetBrickName.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        Packet.writeAsciiz(this.name.padEnd(16, "\0"), data);
    };
    return SetBrickName;
}(SystemPacket));
export { SetBrickName };
