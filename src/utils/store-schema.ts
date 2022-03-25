import { Schema } from "electron-store";

export type InternalSettings = {
	window: {
		width: number;
		height: number;
		position: {
			x: number;
			y: number;
		};
	};
};

export const schema: Schema<InternalSettings> = {
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
		},
	},
};
