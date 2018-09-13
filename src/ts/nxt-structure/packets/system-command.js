export var SystemCommand;
(function (SystemCommand) {
    SystemCommand[SystemCommand["OPEN_READ"] = 128] = "OPEN_READ";
    SystemCommand[SystemCommand["OPEN_WRITE"] = 129] = "OPEN_WRITE";
    SystemCommand[SystemCommand["READ"] = 130] = "READ";
    SystemCommand[SystemCommand["WRITE"] = 131] = "WRITE";
    SystemCommand[SystemCommand["CLOSE"] = 132] = "CLOSE";
    SystemCommand[SystemCommand["DELETE"] = 133] = "DELETE";
    SystemCommand[SystemCommand["FIND_FIRST"] = 134] = "FIND_FIRST";
    SystemCommand[SystemCommand["FIND_NEXT"] = 135] = "FIND_NEXT";
    SystemCommand[SystemCommand["GET_FIRMWARE_VERSION"] = 136] = "GET_FIRMWARE_VERSION";
    SystemCommand[SystemCommand["OPEN_WRITE_LINEAR"] = 137] = "OPEN_WRITE_LINEAR";
    SystemCommand[SystemCommand["OPEN_READ_LINEAR"] = 138] = "OPEN_READ_LINEAR";
    SystemCommand[SystemCommand["OPEN_WRITE_DATA"] = 139] = "OPEN_WRITE_DATA";
    SystemCommand[SystemCommand["OPEN_APPEND_DATA"] = 140] = "OPEN_APPEND_DATA";
    SystemCommand[SystemCommand["SET_BRICK_NAME"] = 152] = "SET_BRICK_NAME";
    SystemCommand[SystemCommand["GET_DEVICE_INFO"] = 155] = "GET_DEVICE_INFO";
})(SystemCommand || (SystemCommand = {}));
