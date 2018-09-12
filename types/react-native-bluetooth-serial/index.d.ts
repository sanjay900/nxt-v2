declare module 'react-native-bluetooth-serial' {
    export type Device = { id: string, name: string };
    export function on(eventName: string, handler: () => any): void;

    export function removeListener(eventName: string, handler: () => {}): void;

    export function write(data: Buffer | string): boolean;
    export function writeToDevice(message: string): boolean;

    export function list(): Promise<Device[]>;
    export function connect(id: string): Promise<boolean>;

    export function requestEnable(): Promise<boolean>;

    export function enable(): Promise<boolean>;

    export function disable(): Promise<boolean>;

    export function isEnabled(): Promise<boolean>;

    export function withDelimiter(delimiter: string): Promise<boolean>;
}