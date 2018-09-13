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
import { SystemOutputPortUtils } from "../../motor/motor-constants";
var ResetMotorPosition = /** @class */ (function (_super) {
    __extends(ResetMotorPosition, _super);
    function ResetMotorPosition() {
        return _super.call(this, DirectCommand.RESET_MOTOR_POSITION) || this;
    }
    ResetMotorPosition.createPacket = function (port, relative) {
        var packet = new ResetMotorPosition();
        packet.port = port;
        packet.relative = relative;
        return packet;
    };
    ResetMotorPosition.createMultiple = function (ports, relative) {
        var e_1, _a;
        var ret = [];
        try {
            for (var _b = __values(SystemOutputPortUtils.fromOutputPort(ports)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var systemOutputPort = _c.value;
                ret.push(ResetMotorPosition.createPacket(systemOutputPort, relative));
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
    ResetMotorPosition.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.port);
        Packet.writeBoolean(this.relative, data);
    };
    return ResetMotorPosition;
}(DirectPacket));
export { ResetMotorPosition };
