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
import { DirectCommand } from "../direct-command";
import { DirectPacket } from "./direct-packet";
var PlaySoundFile = /** @class */ (function (_super) {
    __extends(PlaySoundFile, _super);
    function PlaySoundFile() {
        return _super.call(this, DirectCommand.PLAY_SOUND_FILE) || this;
    }
    PlaySoundFile.createPacket = function (loop, soundFileName) {
        var packet = new PlaySoundFile();
        packet.loop = loop;
        packet.soundFileName = soundFileName;
        return packet;
    };
    PlaySoundFile.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        Packet.writeBoolean(this.loop, data);
        Packet.writeFileName(this.soundFileName, data);
    };
    return PlaySoundFile;
}(DirectPacket));
export { PlaySoundFile };
