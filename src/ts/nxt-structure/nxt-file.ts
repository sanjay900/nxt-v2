export class NXTFile {
    public static PACKET_SIZE: number = 64;
    public handle: number;
    private writtenBytes: number = 0;
    public mode: NXTFileMode;
    public size: number;
    public autoStart: boolean;
    private state: NXTFileState = NXTFileState.OPENING;
    private data: number[] = [];

    constructor(public name: string, private fileData?: number[]) {
        if (fileData) {
            this.data = fileData;
            this.size = fileData.length;
        }
    }

    get status() {
        return this.state;
    }

    set status(status: NXTFileState) {
        this.state = status;
        // this.uploadStatus$.emit(this.state);
    }

    get percentage(): number {
        if (this.writtenBytes == 0) return 0;
        return (this.writtenBytes / this.size * 100);
    }

    hasError() {
        return this.state == NXTFileState.ERROR || this.state == NXTFileState.FILE_EXISTS;
    }

    readData(number: number[]) {
        this.data.push(...number);
    }

    hasWritten(): boolean {
        return this.writtenBytes == this.size;
    }

    nextChunk(): number[] {
        if (this.mode == NXTFileMode.READ) return [];
        let chunkSize: number = Math.min(NXTFile.PACKET_SIZE, this.data.length);
        let ret: number[] = this.data.slice(0, chunkSize);
        this.data = this.data.slice(chunkSize, this.data.length);
        this.writtenBytes = this.size - this.data.length;
        return ret;
    }

}

export enum NXTFileState {
    OPENING = "Opening File",
    WRITING = "Writing File",
    CLOSING = "Closing File",
    WRITTEN = "Written File",
    DELETED = "Deleted File",
    READ = "Read File",
    ERROR = "Error",
    FILE_EXISTS = "File already exists"
}

export enum NXTFileMode {
    READ, WRITE
}
