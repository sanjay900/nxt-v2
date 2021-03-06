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
import { Packet, TelegramType } from "../packet";
var DirectPacket = /** @class */ (function (_super) {
    __extends(DirectPacket, _super);
    function DirectPacket() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DirectPacket.prototype.writePacketData = function (expectResponse, data) {
        data.push(expectResponse ? TelegramType.DIRECT_COMMAND_RESPONSE : TelegramType.DIRECT_COMMAND_NO_RESPONSE);
        data.push(this.id);
    };
    return DirectPacket;
}(Packet));
export { DirectPacket };
