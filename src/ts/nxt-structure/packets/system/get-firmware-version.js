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
var GetFirmwareVersion = /** @class */ (function (_super) {
    __extends(GetFirmwareVersion, _super);
    function GetFirmwareVersion() {
        return _super.call(this, SystemCommand.GET_FIRMWARE_VERSION) || this;
    }
    GetFirmwareVersion.createPacket = function () {
        return new GetFirmwareVersion();
    };
    GetFirmwareVersion.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        var protocolMinor = data.shift();
        var protocolMajor = data.shift();
        var firmwareMinor = data.shift();
        var firmwareMajor = data.shift();
        this.protocolVersion = protocolMajor + "." + protocolMinor;
        this.firmwareVersion = firmwareMajor + "." + firmwareMinor;
    };
    return GetFirmwareVersion;
}(SystemPacket));
export { GetFirmwareVersion };
