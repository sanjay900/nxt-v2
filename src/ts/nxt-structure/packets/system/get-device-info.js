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
import { SystemCommand } from "../system-command";
import 'mdn-polyfills/String.prototype.padStart';
import 'mdn-polyfills/String.prototype.padEnd';
var GetDeviceInfo = /** @class */ (function (_super) {
    __extends(GetDeviceInfo, _super);
    function GetDeviceInfo() {
        return _super.call(this, SystemCommand.GET_DEVICE_INFO) || this;
    }
    GetDeviceInfo.createPacket = function () {
        return new GetDeviceInfo();
    };
    GetDeviceInfo.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.name = Packet.readAsciiz(data, 15);
        this.btAddress = data.splice(0, 6).map(function (bt) { return bt.toString(16).padStart(2, '0'); }).join(":");
        this.btSignalStrength = Packet.readLong(data);
        this.freeSpace = Packet.readLong(data);
    };
    return GetDeviceInfo;
}(SystemPacket));
export { GetDeviceInfo };
