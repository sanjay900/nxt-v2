import { createAction, createAsyncAction } from "typesafe-actions";
export var setName = createAction("setName", function (resolve) {
    return function (name) { return resolve(name); };
});
export var readPacket = createAction("readPacket", function (resolve) {
    return function (packet, type) { return resolve({ packet: packet, type: type }); };
});
export var writePacket = createAsyncAction('writePacketRequest', 'writePacketResponse', 'writePacketFailure')();
