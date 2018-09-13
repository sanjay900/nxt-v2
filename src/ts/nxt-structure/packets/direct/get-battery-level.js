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
var GetBatteryLevel = /** @class */ (function (_super) {
    __extends(GetBatteryLevel, _super);
    function GetBatteryLevel() {
        return _super.call(this, DirectCommand.GET_BATTERY_LEVEL) || this;
    }
    GetBatteryLevel.createPacket = function () {
        return new GetBatteryLevel();
    };
    GetBatteryLevel.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.voltage = Packet.readUWord(data);
    };
    return GetBatteryLevel;
}(DirectPacket));
export { GetBatteryLevel };
