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
/**
 * This provide handles communication with a NXT device, and provides helper methods for uploading files and NXT I/O.
 */
var NxtPacketProvider = /** @class */ (function () {
    function NxtPacketProvider() {
    }
    NxtPacketProvider.prototype.writePacket = function (expectResponse) {
        var packets = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            packets[_i - 1] = arguments[_i];
        }
        var e_1, _a;
        try {
            for (var packets_1 = __values(packets), packets_1_1 = packets_1.next(); !packets_1_1.done; packets_1_1 = packets_1.next()) {
                var packet = packets_1_1.value;
                // this.bluetooth.write(new Uint8Array(packet.writePacket(expectResponse)));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (packets_1_1 && !packets_1_1.done && (_a = packets_1.return)) _a.call(packets_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return NxtPacketProvider;
}());
export { NxtPacketProvider };
export var TelegramType;
(function (TelegramType) {
    TelegramType[TelegramType["DIRECT_COMMAND_RESPONSE"] = 0] = "DIRECT_COMMAND_RESPONSE";
    TelegramType[TelegramType["SYSTEM_COMMAND_RESPONSE"] = 1] = "SYSTEM_COMMAND_RESPONSE";
    TelegramType[TelegramType["REPLY"] = 2] = "REPLY";
    TelegramType[TelegramType["DIRECT_COMMAND_NO_RESPONSE"] = 128] = "DIRECT_COMMAND_NO_RESPONSE";
    TelegramType[TelegramType["SYSTEM_COMMAND_NO_RESPONSE"] = 129] = "SYSTEM_COMMAND_NO_RESPONSE";
})(TelegramType || (TelegramType = {}));
