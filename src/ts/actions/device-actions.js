import { createAction, createAsyncAction } from "typesafe-actions";
export var readPacket = createAction("readPacket", function (resolve) {
    return function (packet, type) { return resolve({ packet: packet, type: type }); };
});
export var writePacket = createAsyncAction('writePacketRequest', 'writePacketResponse', 'writePacketFailure')();
export var writeFile = createAsyncAction('writeFileRequest', 'writeFileResponse', 'writeFileFailure')();
export var writeFileProgress = createAction("writeFileProgress", function (resolve) {
    return function (packet) { return resolve({ packet: packet }); };
});
