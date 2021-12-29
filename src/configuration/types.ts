import colors from "tailwindcss/colors";

export type FileAssociation<T = string> = "text" | "image" | T;

export interface OrdoSettings {
	"last-window.width": number;
	"last-window.height": number;
	"last-window.x": number;
	"last-window.y": number;
	"last-window.folder": string;
	"editor.font": string;
	"editor.tab-size": number;
	"editor.font-size": number;
	"editor.explorer-visible": boolean;
	"editor.auto-closing-brackets": boolean;
	"editor.auto-closing-delete": boolean;
	"editor.auto-closing-quotes": boolean;
	"editor.auto-indent": boolean;
	"editor.auto-surround": boolean;
	"editor.empty-selection-clipboard": boolean;
	"colors.accent": keyof typeof colors;
	"colors.theme": "system" | "light" | "dark";
	"file-explorer.exclude": string[];
	"file-explorer.file-associations": { extension: string; association: FileAssociation<"markdown"> }[];
	"file-explorer.confirm-delete": boolean;
	"file-explorer.enable-drag-and-drop": boolean;
	"minimap.enabled": boolean;
	"minimap.style": "text" | "colors" | "table-of-contents";
	"minimap.scale": 1 | 2 | 3;
}

export type SettingsAPI = {
	get: <K extends keyof OrdoSettings>(key: K) => OrdoSettings[K];
	set: <K extends keyof OrdoSettings>(key: K, value: OrdoSettings[K]) => SettingsAPI;
};
