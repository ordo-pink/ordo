import type { Schema } from "electron-store";

import { UserSettings } from "@core/settings/types";

export const userSettingsSchema: Schema<UserSettings> = {
	appearance: {
		type: "object",
		description: "Appearance::Application appearance settings",
		properties: {
			theme: {
				description: "Theme::Let the darkness (or the lightness?) be with you",
				type: "string",
				enum: ["system", "light", "dark"],
				default: "system",
			},
		},
	},
	graph: {
		type: "object",
		description: "Graph::Graph settings",
		properties: {
			showFolders: {
				description: "Show folders::Turn this on to make graphs show the full filesystem hierarchy including folders",
				type: "boolean",
				default: true,
			},
			showTags: {
				description: "Show tags::Turn this on to make graphs show tags used in files",
				type: "boolean",
				default: true,
			},
			showLinks: {
				description:
					"Show links::Turn this on to make graphs show links between files. Links will be shown as dashed lines, ebmeds will be shown as solid lines",
				type: "boolean",
				default: true,
			},
		},
	},
	editor: {
		type: "object",
		description: "Editor::Editor related settings",
		properties: {
			showLineNumbers: {
				description: "Show line numbers::You would probably need line numbers - they are so convenient!",
				type: "boolean",
				default: true,
			},
			alwaysShowMarkdownSymbols: {
				description:
					"Always show Markdown symbols::Those hashes and stars may be annoying, but seeing them is near and dear to many hearts",
				type: "boolean",
				default: false,
			},
			// autoClosingBrackets: {
			// 	description: "Automatically close brackets::Let or let not the machine do the job for you",
			// 	type: "boolean",
			// 	default: true,
			// },
			// autoClosingQuotes: {
			// 	description: "Automatically close quotes::Let or let not the machine do the job for you",
			// 	type: "boolean",
			// 	default: true,
			// },
			// autoSurround: {
			// 	description: "Automatically surround text::Let or let not the machine do the job for you",
			// 	type: "boolean",
			// 	default: true,
			// },
			// emptySelectionLineToClipboard: {
			// 	description: "Copy without selection::If this is on, you can copy the whole line if it doesn't have selection",
			// 	type: "boolean",
			// 	default: true,
			// },
		},
	},
	explorer: {
		description: "File Explorer::Stuff related to working with files",
		properties: {
			exclude: {
				description: "Ignore files and folders::Beware of the dragons! 🐉",
				type: "array",
				default: ["**/.obsidian", "**/node_modules", "**/.git", "**/.svn", "**/CVS", "**/.DS_Store", "**/Thumbs.db"],
			},
			associations: {
				description: "Associate file type with extension::Beware of the dragons! 🐉",
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
				description: "Confirm removal::Show the annoying alert asking if you are sure you know what you are doing",
				type: "boolean",
				default: true,
			},
			confirmMove: {
				description:
					"Confirm moving and renaming::Show the annoying alert asking if you are sure you know what you are doing",
				type: "boolean",
				default: false,
			},
		},
	},
};
