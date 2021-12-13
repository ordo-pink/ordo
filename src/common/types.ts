import type { IpcMainInvokeEvent } from "electron";
import type { OrdoEntity } from "../file-tree/types";

export type Nullable<T> = T | null;

export type ConnectionType = "fs" | "link" | "tag" | "relation";

export interface Connection {
	source: OrdoEntity;
	target: OrdoEntity;
	exists: boolean;
	type: ConnectionType;
}

export type IpcMainInvokeEventHandler<T extends (...args: any) => any> = (
	e: IpcMainInvokeEvent,
	...args: Parameters<T>
) => ReturnType<T>;
