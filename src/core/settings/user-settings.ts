import Store from "electron-store";

import { userSettingsSchema } from "@core/settings/user-settings-schema";

export const userSettingsStore = new Store({
	name: "preferences",
	clearInvalidConfig: true,
	schema: userSettingsSchema,
	migrations: {
		"0.1.0": (s) => {
			s.set("appearance", { theme: "system", accentColor: "pink" });
			s.set("graph", {
				showFolders: true,
				showTags: true,
				showLinks: true,
			});
			s.set("editor", {
				showLineNumbers: true,
				alwaysShowMarkdownSymbols: true,
				autoClosingBrackets: true,
				autoClosingQuotes: true,
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
				confirmMove: true,
				enableDragAndDrop: true,
			});
		},
		"0.1.1": (s) => {
			s.set("explorer.confirmMove", false);
		},
	},
});
