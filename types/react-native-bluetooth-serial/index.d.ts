declare module 'react-native-bluetooth-serial' {
    export type Device = { id: string, name: string };
    export function on(eventName: string, handler: () => any): void;

    export function removeListener(eventName: string, handler: () => {}): void;

    export function write(data: Buffer | string): Promise<boolean>;
    export function writeToDevice(message: string): Promise<boolean>;
    export function readFromDevice(): Promise<string>;

    export function list(): Promise<Device[]>;
    export function connect(id: string): Promise<boolean>;
    export function disconnect(): Promise<boolean>;

    export function requestEnable(): Promise<boolean>;

    export function enable(): Promise<boolean>;

    export function disable(): Promise<boolean>;

    export function isEnabled(): Promise<boolean>;

    export function withDelimiter(delimiter: string): Promise<boolean>;

    export function discoverUnpairedDevices(): Promise<Device[]>;

    export function cancelDiscovery(): Promise<boolean>;

    export function pairDevice(id: string): Promise<boolean>;

    export function unpairDevice(id: string): Promise<boolean>;

    export function clear(): Promise<boolean>;
    export function available(): Promise<number>;
    export function setAdapterName(newName: string): Promise<boolean>;
}