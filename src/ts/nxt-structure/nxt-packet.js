export var TelegramType;
(function (TelegramType) {
    TelegramType[TelegramType["DIRECT_COMMAND_RESPONSE"] = 0] = "DIRECT_COMMAND_RESPONSE";
    TelegramType[TelegramType["SYSTEM_COMMAND_RESPONSE"] = 1] = "SYSTEM_COMMAND_RESPONSE";
    TelegramType[TelegramType["REPLY"] = 2] = "REPLY";
    TelegramType[TelegramType["DIRECT_COMMAND_NO_RESPONSE"] = 128] = "DIRECT_COMMAND_NO_RESPONSE";
    TelegramType[TelegramType["SYSTEM_COMMAND_NO_RESPONSE"] = 129] = "SYSTEM_COMMAND_NO_RESPONSE";
})(TelegramType || (TelegramType = {}));
