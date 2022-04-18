import { TStore } from "@core/utils/store";
import { BrowserWindow, Dialog } from "electron";
import { Draft } from "immer";
import { app } from "electron";

declare global {
	declare interface Window {
		ordo: {
			emit: <T, K = any>(event: string, payload?: K) => Promise<T>;
		};
	}

	declare type int = number;
	declare type uint = number;
	declare type float = number;
}
