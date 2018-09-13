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
import { DirectPacket } from "./direct-packet";
import { DirectCommand } from "../direct-command";
var GetInputValues = /** @class */ (function (_super) {
    __extends(GetInputValues, _super);
    function GetInputValues() {
        return _super.call(this, DirectCommand.GET_INPUT_VALUES) || this;
    }
    GetInputValues.createPacket = function (port) {
        var packet = new GetInputValues();
        packet.port = port;
        return packet;
    };
    GetInputValues.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.port = data.shift();
        this.valid = Packet.readBoolean(data);
        this.calibrated = Packet.readBoolean(data);
        this.type = data.shift();
        this.mode = data.shift();
        this.rawValue = Packet.readUWord(data);
        this.normalizedValue = Packet.readUWord(data);
        this.scaledValue = Packet.readSWord(data);
        this.calibratedValue = Packet.readSWord(data);
    };
    GetInputValues.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.port);
    };
    return GetInputValues;
}(DirectPacket));
export { GetInputValues };
