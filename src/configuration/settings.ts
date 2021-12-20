import { existsSync, readFileSync, writeFileSync } from "fs";
import { OrdoSettings, SettingsAPI } from "./types";
import YAML from "yaml";

const initialConfig: OrdoSettings = {
	"last-window.width": 800,
	"last-window.height": 600,
	"last-window.x": 0,
	"last-window.y": 0,
	"last-window.folder": null,
	"editor.font": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
	"editor.tab-size": "2rem",
	"editor.font-size": "15px",
	"editor.explorer-visible": true,
	"editor.auto-closing-brackets": true,
	"editor.auto-closing-delete": true,
	"editor.auto-closing-quotes": true,
	"editor.auto-indent": true,
	"editor.auto-surround": true,
	"editor.empty-selection-clipboard": true,
	"colors.accent": "pink",
	"colors.theme": "system",
	"file-explorer.exclude": [
		"**/node_modules",
		"**/.git",
		"**/.svn",
		"**/.hg",
		"**/CVS",
		"**/.DS_Store",
		"**/Thumbs.db",
	],
	"file-explorer.file-associations": [
		{ extension: ".apng", association: "image" },
		{ extension: ".avif", association: "image" },
		{ extension: ".gif", association: "image" },
		{ extension: ".jpg", association: "image" },
		{ extension: ".jpeg", association: "image" },
		{ extension: ".pjpeg", association: "image" },
		{ extension: ".pjp", association: "image" },
		{ extension: ".png", association: "image" },
		{ extension: ".svg", association: "image" },
		{ extension: ".webp", association: "image" },
		{ extension: ".bmp", association: "image" },
		{ extension: ".ico", association: "image" },
		{ extension: ".cur", association: "image" },
		{ extension: ".tif", association: "image" },
		{ extension: ".tiff", association: "image" },
		{ extension: ".md", association: "text" },
		{ extension: ".txt", association: "text" },
	],
	"file-explorer.confirm-delete": true,
	"file-explorer.enable-drag-and-drop": true,
	"minimap.enabled": true,
	"minimap.style": "colors",
	"minimap.scale": 1,
};

let config: OrdoSettings;
let savedPath: string;

export const getSettings = (path?: string): SettingsAPI => {
	if (!savedPath && path) {
		savedPath = path;
	}

	if (!path && savedPath) {
		path = savedPath;
	}

	if (!existsSync(path) && path) {
		writeFileSync(path, YAML.stringify(initialConfig), "utf-8");
	}

	if (!config && path) {
		try {
			config = YAML.parse(readFileSync(path, "utf-8"));
		} catch (e) {
			writeFileSync(path, YAML.stringify(initialConfig), "utf-8");
			config = YAML.parse(readFileSync(path, "utf-8"));
		}
	}

	if (!config && !path) {
		config = { ...initialConfig };
	}

	const api = {
		get: <K extends keyof OrdoSettings>(key: K) => config[key],
		set: <K extends keyof OrdoSettings>(key: K, value: OrdoSettings[K]) => {
			config[key] = value;
			writeFileSync(path, YAML.stringify(config), "utf-8");

			return api;
		},
	};

	return api;
};
