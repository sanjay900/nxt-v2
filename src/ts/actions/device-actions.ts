import {createAction, createAsyncAction} from "typesafe-actions";
import {Packet} from "../nxt-structure/packets/packet";
import {DirectCommand} from "../nxt-structure/packets/direct-command";
import {SystemCommand} from "../nxt-structure/packets/system-command";
import {NXTFile} from "../nxt-structure/nxt-file";


export const readPacket = createAction("readPacket", resolve => {
    return (packet: Packet, type: DirectCommand | SystemCommand) => resolve({packet, type});
});

export const setName = createAsyncAction(
  'setNameRequest',
  'setNameResponse',
  'setNameFailure'
)<string, void, Error>();

export const writePacket = createAsyncAction(
    'writePacketRequest',
    'writePacketResponse',
    'writePacketFailure'
)<Packet, void, Error>();

export const writeFile = createAsyncAction(
  'writeFileRequest',
  'writeFileResponse',
  'writeFileFailure'
)<NXTFile, void, Error>();
