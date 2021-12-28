export interface CaretPosition {
	line: number;
	index: number;
}

export interface ChangeSelection {
	start: CaretPosition;
	end: CaretPosition;
	direction: "ltr" | "rtl";
}

export interface ChangeKeys {
	key: string;
	metaKey: boolean;
	ctrlKey: boolean;
	shiftKey: boolean;
	altKey: boolean;
}

export interface Change {
	selection: ChangeSelection;
	keys?: ChangeKeys;
}

export interface ChangeResponse extends Change {
	content: string[];
}
