import {createAction, createAsyncAction} from "typesafe-actions";
import {Packet} from "../nxt-structure/packets/packet";
import {DirectCommand} from "../nxt-structure/packets/direct-command";
import {SystemCommand} from "../nxt-structure/packets/system-command";
import {NXTFile} from "../nxt-structure/nxt-file";
import {Write} from "../nxt-structure/packets/system/write";
import {PacketError} from "../reducers/device";


export const readPacket = createAction("readPacket", resolve => {
    return (packet: Packet, type: DirectCommand | SystemCommand) => resolve({packet, type});
});

export const writePacket = createAsyncAction(
    'writePacketRequest',
    'writePacketResponse',
    'writePacketFailure'
)<Packet, void, PacketError>();

export const writeFile = createAsyncAction(
  'writeFileRequest',
  'writeFileResponse',
  'writeFileFailure'
)<NXTFile, void, PacketError>();

export const writeFileProgress = createAction("writeFileProgress", resolve => {
    return (packet: Write) => resolve({packet});
});