declare module '@remobile/react-native-toast' {
    export type Options = { message: string, duration: "long" | "short", position: "top" | "bottom" | "center", addPixelsX?: number, addPixelsY?: number };

    export function showWithOptions(options: Options): void;

    export function hide(): void;

    export function showShortTop(message: string): void;
    export function showShortCenter(message: string): void;
    export function showShortBottom(message: string): void;
    export function showLongTop(message: string): void;
    export function showLongCenter(message: string): void;
    export function showLongBottom(message: string): void;
    export function show(message: string): void;
}