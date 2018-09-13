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
var StopProgram = /** @class */ (function (_super) {
    __extends(StopProgram, _super);
    function StopProgram() {
        return _super.call(this, DirectCommand.STOP_PROGRAM) || this;
    }
    StopProgram.createPacket = function () {
        return new StopProgram();
    };
    return StopProgram;
}(DirectPacket));
export { StopProgram };
