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
import { SystemCommandResponse } from "./packets/system-command-response";
import { DirectCommandResponse } from "./packets/direct-command-response";
import { Utils } from "../utils/utils";
var NXTFile = /** @class */ (function () {
    function NXTFile(name, nxt, file) {
        this.name = name;
        this.nxt = nxt;
        this.file = file;
        this.writtenBytes = 0;
        this.state = NXTFileState.OPENING;
        this.data = [];
    }
    Object.defineProperty(NXTFile.prototype, "response", {
        get: function () {
            return this._response;
        },
        set: function (value) {
            this._response = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NXTFile.prototype, "status", {
        get: function () {
            return this.state;
        },
        set: function (status) {
            this.state = status;
            // this.uploadStatus$.emit(this.state);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NXTFile.prototype, "percentage", {
        get: function () {
            if (this.writtenBytes == 0)
                return 0;
            return (this.writtenBytes / this.size * 100);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NXTFile.prototype, "formattedErrorMessage", {
        get: function () {
            if (!this.hasError())
                return "No Error";
            return Utils.formatTitle(DirectCommandResponse[this._response] || SystemCommandResponse[this._response]);
        },
        enumerable: true,
        configurable: true
    });
    NXTFile.prototype.hasError = function () {
        return this.state == NXTFileState.ERROR || this.state == NXTFileState.FILE_EXISTS;
    };
    NXTFile.prototype.readData = function (number) {
        var _a;
        (_a = this.data).push.apply(_a, __spread(number));
    };
    // readFromFileSystem() {
    //   return this.file.readAsArrayBuffer(this.file.applicationDirectory, "www/assets/" + this.name).then(contents => {
    //     this.data = Array.from(new Uint8Array(contents));
    //     this.size = contents.byteLength;
    //   });
    // }
    //
    // writeFileToDevice() {
    //   let subscription: Subscription = this.nxt.packetEvent$
    //     .filter(packet => packet.id == SystemCommand.OPEN_WRITE)
    //     .filter((packet: OpenWrite) => packet.file == this)
    //     .subscribe(packet => {
    //       subscription.unsubscribe();
    //       if (packet.status != SystemCommandResponse.SUCCESS) {
    //         return;
    //       }
    //       this.writeSubscription = this.nxt.packetEvent$
    //         .filter(packet => packet.id == SystemCommand.WRITE)
    //         .filter((packet: Write) => packet.file == this)
    //         .subscribe(this.write.bind(this));
    //       this.write();
    //     });
    //   this.nxt.writePacket(true, OpenWrite.createPacket(this));
    // }
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
export var NXTFileState;
(function (NXTFileState) {
    NXTFileState["OPENING"] = "Opening File";
    NXTFileState["WRITING"] = "Writing File";
    NXTFileState["CLOSING"] = "Closing File";
    NXTFileState["WRITTEN"] = "Written File";
    NXTFileState["DELETED"] = "Deleted File";
    NXTFileState["READ"] = "Read File";
    NXTFileState["ERROR"] = "Error";
    NXTFileState["FILE_EXISTS"] = "File already exists";
})(NXTFileState || (NXTFileState = {}));
export var NXTFileMode;
(function (NXTFileMode) {
    NXTFileMode[NXTFileMode["READ"] = 0] = "READ";
    NXTFileMode[NXTFileMode["WRITE"] = 1] = "WRITE";
})(NXTFileMode || (NXTFileMode = {}));
