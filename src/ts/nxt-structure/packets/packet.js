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
import 'mdn-polyfills/String.prototype.padEnd';
import { Subject } from "rxjs";
var Packet = /** @class */ (function () {
    function Packet(_id) {
        this._id = _id;
        this.responseReceived = new Subject();
    }
    Object.defineProperty(Packet.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Packet.readSWord = function (data) {
        return Packet.readUWord(data) - Packet.S_WORD_LENGTH;
    };
    Packet.readUWord = function (data) {
        return data.shift() | data.shift() << 8;
    };
    Packet.writeWord = function (short, data) {
        data.push(short, short >> 8);
    };
    Packet.writeLong = function (long, data) {
        data.push(long, long >> 8, long >> 16, long >> 24);
    };
    Packet.readLong = function (data) {
        return data.shift() | data.shift() << 8 | data.shift() << 16 | data.shift() << 24;
    };
    Packet.writeBoolean = function (bool, data) {
        data.push(bool ? 1 : 0);
    };
    Packet.readBoolean = function (data) {
        return data.shift() == 1;
    };
    Packet.readAsciiz = function (data, size) {
        var message = "";
        for (var i = 0; i < size; i++) {
            message += String.fromCharCode(data.shift());
        }
        return message;
    };
    Packet.writeAsciiz = function (message, data) {
        for (var i = 0; i < message.length; i++) {
            data.push(message.charCodeAt(i));
        }
        data.push(0);
    };
    Packet.writeFileName = function (fileName, data) {
        fileName.padEnd(Packet.FILE_NAME_LENGTH, '\0');
        this.writeAsciiz(fileName, data);
    };
    Packet.prototype.readPacket = function (data) {
        this.status = data.shift();
    };
    Packet.prototype.writePacket = function (expectResponse) {
        var data = [];
        this.writePacketData(expectResponse, data);
        var header = [];
        Packet.writeWord(data.length, header);
        data.unshift.apply(data, __spread(header));
        return new Uint8Array(data);
    };
    Packet.FILE_NAME_LENGTH = 20;
    Packet.S_WORD_LENGTH = 20;
    return Packet;
}());
export { Packet };
