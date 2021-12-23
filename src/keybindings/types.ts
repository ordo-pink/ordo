export interface KeyboardShortcut {
	label: string;
	accelerator: string;
	action: (...args: any) => any;
}
