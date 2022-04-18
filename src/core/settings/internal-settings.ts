import Store, { Schema } from "electron-store";
import { InternalSettings } from "./types";

export const internalSettingsSchema: Schema<InternalSettings> = {
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
			sideBarWidth: {
				type: "number",
				default: 20,
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
};

export const internalSettingsStore = new Store({
	name: "internal",
	clearInvalidConfig: true,
	schema: internalSettingsSchema,
	migrations: {
		"0.1.0": (s) => {
			s.set("window", { width: 800, height: 600, recentProjects: [], sideBarWidth: 20 });
		},
	},
});
