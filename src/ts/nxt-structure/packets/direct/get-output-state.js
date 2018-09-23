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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
import { Packet } from "../packet";
import { DirectPacket } from "./direct-packet";
import { DirectCommand } from "../direct-command";
import { SystemOutputPortUtils } from "../../motor-constants";
var GetOutputState = /** @class */ (function (_super) {
    __extends(GetOutputState, _super);
    function GetOutputState() {
        return _super.call(this, DirectCommand.GET_OUTPUT_STATE) || this;
    }
    GetOutputState.createPacket = function (port) {
        var packet = new GetOutputState();
        packet.port = port;
        return packet;
    };
    GetOutputState.createMultiple = function (ports) {
        var e_1, _a;
        var ret = [];
        try {
            for (var _b = __values(SystemOutputPortUtils.fromOutputPort(ports)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var systemOutputPort = _c.value;
                ret.push(GetOutputState.createPacket(systemOutputPort));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return ret;
    };
    GetOutputState.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
        this.port = data.shift();
        this.power = data.shift();
        this.mode = data.shift();
        this.regulationMode = data.shift();
        this.turnRatio = data.shift();
        this.runState = data.shift();
        this.tachoLimit = Packet.readLong(data);
        this.tachoCount = Packet.readLong(data);
        this.blockTachoCount = Packet.readLong(data);
        this.rotationCount = Packet.readLong(data);
    };
    GetOutputState.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.port);
    };
    GetOutputState.prototype.toOutputData = function () {
        var _a = this, port = _a.port, power = _a.power, rotationCount = _a.rotationCount, tachoLimit = _a.tachoLimit, turnRatio = _a.turnRatio, tachoCount = _a.tachoCount, blockTachoCount = _a.blockTachoCount;
        return { port: port, power: power, rotationCount: rotationCount, tachoLimit: tachoLimit, turnRatio: turnRatio, tachoCount: tachoCount, blockTachoCount: blockTachoCount };
    };
    return GetOutputState;
}(DirectPacket));
export { GetOutputState };
