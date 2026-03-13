import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Child {
    age: bigint;
    emergency: boolean;
    name: string;
    parentPhone: string;
    chipID: string;
}
export interface backendInterface {
    clearEmergency(chipID: string): Promise<void>;
    getAllChildren(): Promise<Array<Child>>;
    getChild(chipID: string): Promise<Child>;
    registerChild(name: string, age: bigint, chipID: string, parentPhone: string): Promise<void>;
    scanChip(chipID: string): Promise<Child>;
}
