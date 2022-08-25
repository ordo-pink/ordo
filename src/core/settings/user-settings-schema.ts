import type { Schema } from "electron-store";

import { UserSettings } from "@core/settings/types";

export const userSettingsSchema: Schema<UserSettings> = {
  appearance: {
    type: "object",
    description: "core.settings.appearance",
    properties: {
      theme: {
        description: "core.settings.appearance.theme",
        type: "string",
        enum: ["system", "light", "dark"],
        default: "system",
      },
      language: {
        description: "core.settings.appearance.language",
        type: "string",
        enum: ["ru-RU", "en-US"],
      },
    },
  },
  graph: {
    type: "object",
    description: "core.settings.graph",
    properties: {
      showFolders: {
        description: "core.settings.graph.show-folders",
        type: "boolean",
        default: true,
      },
      showTags: {
        description: "core.settings.graph.show-tags",
        type: "boolean",
        default: true,
      },
      showLinks: {
        description: "core.settings.graph.show-links",
        type: "boolean",
        default: true,
      },
    },
  },
  editor: {
    type: "object",
    description: "core.settings.editor",
    properties: {
      showLineNumbers: {
        description: "core.settings.editor.show-line-numbers",
        type: "boolean",
        default: true,
      },
      alwaysShowMarkdownSymbols: {
        description: "core.settings.editor.always-show-markdown-symbols",
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
    description: "core.settings.file-explorer",
    properties: {
      exclude: {
        description: "core.settings.file-explorer.exclude",
        type: "array",
        default: ["**/.obsidian", "**/node_modules", "**/.git", "**/.svn", "**/CVS", "**/.DS_Store", "**/Thumbs.db"],
      },
      associations: {
        description: "core.settings.file-explorer.associations",
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
        description: "core.settings.file-explorer.confirm-delete",
        type: "boolean",
        default: true,
      },
      confirmMove: {
        description: "core.settings.file-explorer.confirm-move",
        type: "boolean",
        default: false,
      },
    },
  },
};
