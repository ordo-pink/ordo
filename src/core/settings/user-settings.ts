import Store, { Schema } from "electron-store";

import { Colors } from "@core/appearance/colors";
import { UserSettings } from "@core/settings/types";

export const userSettingsSchema: Schema<UserSettings> = {
	appearance: {
		type: "object",
		properties: {
			theme: {
				type: "string",
				enum: ["system", "light", "dark"],
				default: "system",
			},
			accentColor: {
				type: "string",
				enum: Colors as unknown as string[],
				default: "pink",
			},
		},
	},
	editor: {
		type: "object",
		properties: {
			showLineNumbers: {
				type: "boolean",
				default: false,
			},
			alwaysShowMarkdownSymbols: {
				type: "boolean",
				default: false,
			},
			font: {
				type: "string",
				default: "",
			},
			fontSize: {
				type: "number",
				default: 16,
			},
			tabSize: {
				type: "number",
				default: 2,
			},
			autoClosingBrackets: {
				type: "boolean",
				default: true,
			},
			autoClosingQuotes: {
				type: "boolean",
				default: true,
			},
			autoIndent: {
				type: "boolean",
				default: true,
			},
			autoSurround: {
				type: "boolean",
				default: true,
			},
			emptySelectionLineToClipboard: {
				type: "boolean",
				default: true,
			},
		},
	},
	explorer: {
		type: "object",
		properties: {
			exclude: {
				type: "array",
				default: ["**/.obsidian", "**/node_modules", "**/.git", "**/.svn", "**/CVS", "**/.DS_Store", "**/Thumbs.db"],
			},
			associations: {
				type: "array",
				default: [
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
			},
			confirmDelete: {
				type: "boolean",
				default: true,
			},
			enableDragAndDrop: {
				type: "boolean",
				default: true,
			},
		},
	},
};

export const userSettingsStore = new Store({
	name: "preferences",
	clearInvalidConfig: true,
	schema: userSettingsSchema,
	migrations: {
		"0.1.0": (s) => {
			s.set("appearance", { theme: "system", accentColor: "pink" });
			s.set("editor", {
				showLineNumbers: true,
				alwaysShowMarkdownSymbols: true,
				fontSize: 16,
				tabSize: 2,
				autoClosingBrackets: true,
				autoClosingQuotes: true,
				autoIndent: true,
				autoSurround: true,
				emptySelectionLineToClipboard: true,
			});
			s.set("explorer", {
				exclude: ["**/.obsidian", "**/node_modules", "**/.git", "**/.svn", "**/CVS", "**/.DS_Store", "**/Thumbs.db"],
				associations: [
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
					{ extension: ".md", association: "document" },
					{ extension: ".txt", association: "document" },
				],
				confirmDelete: true,
				enableDragAndDrop: true,
			});
		},
	},
});
