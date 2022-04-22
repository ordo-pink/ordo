import { Color } from "@core/appearance/colors";

export type InternalSettings = {
	separator: string;
	window: {
		width: number;
		height: number;
		position: {
			x: number;
			y: number;
		};
		sideBarWidth: number;
		recentProjects: string[];
		lastOpenProject: string;
	};
};

export type UserSettings = {
	appearance: {
		theme: "system" | "light" | "dark";
		accentColor: Color;
	};
	editor: {
		showLineNumbers: boolean;
		alwaysShowMarkdownSymbols: boolean;
		font: string;
		fontSize: number;
		tabSize: number;
		autoClosingBrackets: boolean;
		autoClosingQuotes: boolean;
		autoIndent: boolean;
		autoSurround: boolean;
		emptySelectionLineToClipboard: boolean;
	};
	explorer: {
		exclude: string[];
		associations: Array<{ extension: string; association: string }>;
		confirmDelete: boolean;
		enableDragAndDrop: boolean;
	};
};
