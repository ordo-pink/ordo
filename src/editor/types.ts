export interface ChangeSelection {
	start: number;
	length: number;
	line: number;
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
	keys: ChangeKeys;
}

export interface ChangeResponse extends Change {
	content: string[];
}
