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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { DirectCommand } from "../direct-command";
import { DirectPacket } from "./direct-packet";
var LsWrite = /** @class */ (function (_super) {
    __extends(LsWrite, _super);
    function LsWrite() {
        return _super.call(this, DirectCommand.LS_WRITE) || this;
    }
    LsWrite.createPacket = function (port, txData, rxDataLength) {
        var packet = new LsWrite();
        packet.port = port - 1;
        packet.txData = txData;
        packet.rxDataLength = rxDataLength;
        return packet;
    };
    LsWrite.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.port);
        data.push(this.txData.length);
        data.push(this.rxDataLength);
        data.push.apply(data, __spread(this.txData));
    };
    return LsWrite;
}(DirectPacket));
export { LsWrite };
