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
var PlayTone = /** @class */ (function (_super) {
    __extends(PlayTone, _super);
    function PlayTone() {
        return _super.call(this, DirectCommand.PLAY_TONE) || this;
    }
    PlayTone.createPacket = function (frequency, duration) {
        var packet = new PlayTone();
        packet.frequency = frequency;
        packet.duration = duration;
        return packet;
    };
    PlayTone.prototype.writePacketData = function (expectResponse, data) {
        _super.prototype.writePacketData.call(this, expectResponse, data);
        Packet.writeWord(this.frequency, data);
        Packet.writeWord(this.duration, data);
    };
    return PlayTone;
}(DirectPacket));
export { PlayTone };
