import { TStore } from "@core/utils/store";
import { BrowserWindow, Dialog } from "electron";
import { Draft } from "immer";
import { app } from "electron";

declare global {
	declare interface Window {
		ordo: {
			emit: <E extends OrdoEvent, K extends keyof E, V extends E[K]>(event: K, request: V) => void;
			emit: <E extends OrdoEvent, K extends keyof E>(event: K) => void;
		};
	}

	declare type int = number;
	declare type uint = number;
	declare type float = number;
}
