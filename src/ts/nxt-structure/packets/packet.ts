import {DirectCommandResponse} from "./direct-command-response";
import {SystemCommandResponse} from "./system-command-response";
import {SystemCommand} from "./system-command";
import {DirectCommand} from "./direct-command";
import 'mdn-polyfills/String.prototype.padEnd';
import {Subject} from "rxjs";
import {packetBuffer} from "../../store";

export abstract class Packet {
    static FILE_NAME_LENGTH: number = 19;
    static S_WORD_LENGTH: number = 20;
    public status: DirectCommandResponse | SystemCommandResponse;
    public responseReceived: Subject<Packet> = new Subject();

    protected constructor(protected _id: SystemCommand | DirectCommand) {

    }

    get id(): SystemCommand | DirectCommand {
        return this._id;
    }

    protected static readSWord(data: number[]): number {
        return Packet.readUWord(data) - Packet.S_WORD_LENGTH;
    }

    protected static readUWord(data: number[]): number {
        return data.shift()! | data.shift()! << 8;
    }

    protected static writeWord(short: number, data: number[]) {
        data.push(short, short >> 8);
    }

    protected static writeLong(long: number, data: number[]) {
        data.push(long, long >> 8, long >> 16, long >> 24);
    }

    protected static readLong(data: number[]): number {
        return data.shift()! | data.shift()! << 8 | data.shift()! << 16 | data.shift()! << 24;
    }

    protected static writeBoolean(bool: boolean, data: number[]) {
        data.push(bool ? 1 : 0);
    }

    protected static readBoolean(data: number[]): boolean {
        return data.shift() == 1;
    }

    protected static readAsciiz(data: number[], size: number): string {
        let message: string = "";
        for (let i = 0; i < size; i++) {
            let next = data.shift()!;
            //Skip null terminators
            if (next != 0) {
                message += String.fromCharCode(next);
            }
        }
        return message;
    }

    protected static writeAsciiz(message: string, data: number[]) {
        for (let i = 0; i < message.length; i++) {
            data.push(message.charCodeAt(i));
        }
        data.push(0);
    }

    protected static writeFileName(fileName: string, data: number[]) {
        this.writeAsciiz(fileName.padEnd(Packet.FILE_NAME_LENGTH, '\0'), data);
    }

    public readPacket(data: number[]) {
        this.status = data.shift()!;
    }

    public writePacket(expectResponse: boolean): Uint8Array {
        let data: number[] = [];
        this.writePacketData(expectResponse, data);
        let header: number[] = [];
        Packet.writeWord(data.length, header);
        data.unshift(...header);
        packetBuffer.push(this);
        return new Uint8Array(data);
    }

    public packetMatches(data: number[]): boolean {
        return data[0] == this.id;
    }

    protected abstract writePacketData(expectResponse: boolean, data: number[]): void;
}

export enum TelegramType {
    DIRECT_COMMAND_RESPONSE = 0x00,
    SYSTEM_COMMAND_RESPONSE = 0x01,
    REPLY = 0x02,
    DIRECT_COMMAND_NO_RESPONSE = 0x80,
    SYSTEM_COMMAND_NO_RESPONSE = 0x81
}