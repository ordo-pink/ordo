import { DocumentRoot } from "./types";

export const createRoot = (path: string): DocumentRoot => ({
	type: "root",
	children: [],
	data: null,
	path,
	raw: "",
	length: 0,
	id: "1",
	depth: 0,
	range: {
		start: {
			line: 1,
			character: 1,
		},
		end: {
			line: 1,
			character: 1,
		},
	},
});
