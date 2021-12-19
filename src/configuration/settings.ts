import { existsSync, readFileSync, writeFileSync } from "fs";
import { OrdoSettings, SettingsAPI } from "./types";
import YAML from "yaml";

const initialConfig: OrdoSettings = {
	"last-window.width": 800,
	"last-window.height": 600,
	"last-window.x": 0,
	"last-window.y": 0,
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
		// TODO
	],
	"file-explorer.confirm-delete": true,
	"file-explorer.enable-drag-and-drop": true,
	"minimap.enabled": true,
	"minimap.style": "colors",
	"minimap.scale": 1,
};

let config: OrdoSettings;

export const getSettings = (path: string): SettingsAPI => {
	if (!existsSync(path)) {
		writeFileSync(path, YAML.stringify(initialConfig), "utf-8");
	}

	if (!config) {
		try {
			config = YAML.parse(readFileSync(path, "utf-8"));
		} catch (e) {
			writeFileSync(path, YAML.stringify(initialConfig), "utf-8");
			config = YAML.parse(readFileSync(path, "utf-8"));
		}
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
