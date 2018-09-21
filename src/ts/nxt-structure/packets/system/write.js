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
import { SystemPacket } from "./system-packet";
import { SystemCommand } from "../system-command";
var Write = /** @class */ (function (_super) {
    __extends(Write, _super);
    function Write() {
        return _super.call(this, SystemCommand.WRITE) || this;
    }
    Write.createPacket = function (file) {
        var packet = new Write();
        packet.file = file;
        return packet;
    };
    Write.prototype.readPacket = function (data) {
        _super.prototype.readPacket.call(this, data);
    };
    Write.prototype.packetMatches = function (data) {
        return _super.prototype.packetMatches.call(this, data) && data[2] == this.file.handle;
    };
    Write.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        data.push(this.file.handle);
        data.push.apply(data, __spread(this.file.nextChunk()));
    };
    return Write;
}(SystemPacket));
export { Write };
