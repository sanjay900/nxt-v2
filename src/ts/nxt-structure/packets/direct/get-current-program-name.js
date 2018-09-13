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
var GetCurrentProgramName = /** @class */ (function (_super) {
    __extends(GetCurrentProgramName, _super);
    function GetCurrentProgramName() {
        return _super.call(this, DirectCommand.GET_CURRENT_PROGRAM_NAME) || this;
    }
    GetCurrentProgramName.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.programName = Packet.readAsciiz(data, Packet.FILE_NAME_LENGTH);
    };
    return GetCurrentProgramName;
}(DirectPacket));
export { GetCurrentProgramName };
