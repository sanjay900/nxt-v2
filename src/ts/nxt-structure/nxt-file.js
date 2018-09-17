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
var NXTFile = /** @class */ (function () {
    function NXTFile(name, fileData) {
        this.name = name;
        this.fileData = fileData;
        this.writtenBytes = 0;
        this.data = [];
        if (fileData) {
            this.data = fileData;
            this.size = fileData.length;
        }
    }
    Object.defineProperty(NXTFile.prototype, "percentage", {
        get: function () {
            if (this.writtenBytes == 0)
                return 0;
            return (this.writtenBytes / this.size * 100);
        },
        enumerable: true,
        configurable: true
    });
    NXTFile.prototype.readData = function (number) {
        var _a;
        (_a = this.data).push.apply(_a, __spread(number));
    };
    NXTFile.prototype.hasWritten = function () {
        return this.writtenBytes == this.size;
    };
    NXTFile.prototype.nextChunk = function () {
        if (this.mode == NXTFileMode.READ)
            return [];
        var chunkSize = Math.min(NXTFile.PACKET_SIZE, this.data.length);
        var ret = this.data.slice(0, chunkSize);
        this.data = this.data.slice(chunkSize, this.data.length);
        this.writtenBytes = this.size - this.data.length;
        return ret;
    };
    NXTFile.PACKET_SIZE = 64;
    return NXTFile;
}());
export { NXTFile };
export var NXTFileMode;
(function (NXTFileMode) {
    NXTFileMode[NXTFileMode["READ"] = 0] = "READ";
    NXTFileMode[NXTFileMode["WRITE"] = 1] = "WRITE";
})(NXTFileMode || (NXTFileMode = {}));
