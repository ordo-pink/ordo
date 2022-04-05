import Store from "electron-store";
import { Color, Colors } from "@core/apprearance/colors";
import { Schema } from "electron-store";

export type InternalSettings = {
	appearance: {
		theme: "system" | "light" | "dark";
		accentColor: Color;
	};
	window: {
		width: number;
		height: number;
		position: {
			x: number;
			y: number;
		};
		recentProjects: string[];
		lastOpenProject: string;
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

export const schema: Schema<InternalSettings> = {
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
	window: {
		type: "object",
		properties: {
			width: {
				type: "number",
				default: 800,
			},
			height: {
				type: "number",
				default: 600,
			},
			position: {
				type: "object",
				properties: {
					x: {
						type: ["number", "null"],
						default: null,
					},
					y: {
						type: ["number", "null"],
						default: null,
					},
				},
			},
			recentProjects: {
				type: "array",
				items: [{ type: "string" }],
				default: [],
			},
			lastOpenFolder: {
				type: "string",
				default: "",
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
				default: [".obsidian", "**/node_modules", "**/.git", "**/.svn", "**/CVS", "**/.DS_Store", "**/Thumbs.db"],
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

export const store = new Store({
	schema,
	migrations: {
		"0.1.0": (s) => {
			s.set("window", { width: 800, height: 600, recentProjects: [] });
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
				exclude: ["**/node_modules", "**/.git", "**/.svn", "**/CVS", "**/.DS_Store", "**/Thumbs.db"],
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
