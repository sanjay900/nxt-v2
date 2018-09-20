declare module 'dot-prop-immutable' {
    export function set(obj: any, prop: string, value: any): any;
    export function get(obj: any, prop: string, value: any): any;
    export function _delete(obj: any, prop: string): any;
}