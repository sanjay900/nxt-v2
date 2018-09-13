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
var StartProgram = /** @class */ (function (_super) {
    __extends(StartProgram, _super);
    function StartProgram() {
        return _super.call(this, DirectCommand.START_PROGRAM) || this;
    }
    StartProgram.createPacket = function (programName) {
        var packet = new StartProgram();
        packet.programName = programName;
        return packet;
    };
    StartProgram.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        Packet.writeFileName(this.programName, data);
    };
    return StartProgram;
}(DirectPacket));
export { StartProgram };
