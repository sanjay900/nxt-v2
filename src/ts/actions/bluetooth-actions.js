import { createAction, createAsyncAction } from "typesafe-actions";
export var setDevice = createAction("setDevice", function (resolve) {
    return function (device) { return resolve(device); };
});
export var changeStatus = createAction("changeStatus", function (resolve) {
    return function (status, message) { return resolve({ status: status, message: message }); };
});
export var disconnect = createAction("disconnect");
export var readPacket = createAction("readPacket", function (resolve) {
    return function (packet, type) { return resolve({ packet: packet, type: type }); };
});
export var writePacket = createAsyncAction('writePacketRequest', 'writePacketResponse', 'writePacketFailure')();
export var connectToDevice = createAsyncAction('connectToDeviceRequest', 'connectToDeviceResponse', 'connectToDeviceFailure')();
export var listDevices = createAsyncAction('listDevicesRequest', 'listDevicesResponse', 'listDevicesFailure')();
