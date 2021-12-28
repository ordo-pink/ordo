import { WindowState } from "../common/types";

export interface KeyboardShortcut {
	label: string;
	accelerator: string;
	action: (state: WindowState) => unknown;
}
