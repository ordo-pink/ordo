import { Color } from "@core/apprearance/colors";
import remarkWikiLink from "remark-wiki-link";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { attachIds, extractFrontmatter, groupByLines, wikiLinkEmbeds } from "@utils/remark-extensions";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { getFile } from "@modules/file-explorer/file-tree/get-file";
import remarkFrontmatter from "remark-frontmatter";

export type OrdoFile<T = any> = {
	path: string;
	readableName: string;
	relativePath: string;
	depth: number;
	createdAt?: Date;
	updatedAt?: Date;
	accessedAt?: Date;
	extension: string;
	size: number;
	readableSize: string;
	raw?: string;
	data?: T;
	ranges?: Array<{
		start: {
			line: int;
			character: int;
		};
		end: {
			line: int;
			character: int;
		};
		direction: "ltr" | "rtl";
	}>;
	type: "image" | "document" | "file";
};

export type OrdoFolder = {
	collapsed: boolean;
	path: string;
	readableName: string;
	relativePath: string;
	depth: number;
	createdAt: Date;
	updatedAt: Date;
	accessedAt: Date;
	children: Array<OrdoFolder | OrdoFile>;
	color: Color;
	type: "folder";
};

export type EditorState = {
	tabs: OrdoFile[];
	currentTab: string;
};

export const initialState: EditorState = {
	currentTab: "",
	tabs: [],
};

export const openTab = createAsyncThunk("@editor/open-tab", (path: string) =>
	window.ordo.emit<string>("@file-explorer/read-file", path).then((raw) => ({ raw, path })),
);

export const parseMarkdown = createAsyncThunk("@editor/parse-markdown", async ({ raw, path }: any) => {
	const processor = unified().use(remarkParse).use(remarkWikiLink);
	const ast = processor.parse(raw);
	const data = await unified().use(wikiLinkEmbeds).use(groupByLines).use(attachIds).run(ast);

	return {
		data,
		raw,
		path,
	};
});

export const editorSlice = createSlice({
	name: "editor",
	initialState,
	reducers: {
		closeTab: (state, action: PayloadAction<string>) => {
			const currentTab = state.tabs.findIndex((tab) => tab.path === action.payload);

			if (currentTab === -1) {
				return;
			}

			state.tabs.splice(currentTab, 1);

			if (state.currentTab === action.payload) {
				state.currentTab = state.tabs.length ? state.tabs[0].path : "";
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(openTab.fulfilled, (state, action) => {
				state.currentTab = action.payload.path;

				let currentTab = state.tabs.find((tab) => tab.path === action.payload.path) as OrdoFile;

				if (!currentTab) {
					state.tabs.push(action.payload as any);
					currentTab = state.tabs[state.tabs.length - 1];
				}

				if (!currentTab || currentTab.raw == null) {
					currentTab.raw = action.payload.raw;
				}
			})
			.addCase(parseMarkdown.fulfilled, (state, action) => {
				const tab = state.tabs.find((t) => t.path === action.payload.path);

				if (!tab) {
					return;
				}

				tab.data = action.payload.data;
			});
	},
});

export const { closeTab } = editorSlice.actions;

export const editorReducer = editorSlice.reducer;
