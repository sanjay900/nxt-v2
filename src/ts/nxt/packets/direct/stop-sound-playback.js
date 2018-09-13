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
import { DirectCommand } from "../direct-command";
import { DirectPacket } from "./direct-packet";
var StopSoundPlayback = /** @class */ (function (_super) {
    __extends(StopSoundPlayback, _super);
    function StopSoundPlayback() {
        return _super.call(this, DirectCommand.STOP_SOUND_PLAYBACK) || this;
    }
    StopSoundPlayback.createPacket = function () {
        return new StopSoundPlayback();
    };
    return StopSoundPlayback;
}(DirectPacket));
export { StopSoundPlayback };
