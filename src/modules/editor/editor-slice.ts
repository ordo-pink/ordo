import { Color } from "@core/apprearance/colors";
import remarkWikiLink from "remark-wiki-link";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { wikiLinkEmbeds } from "@utils/remark-extensions";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

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
	currentTab: "/absolute/relative",
	tabs: [
		{
			path: "/absolute/relative",
			readableName: "Test",
			relativePath: "relative",
			depth: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			accessedAt: new Date(),
			extension: ".md",
			size: 0,
			readableSize: "0 Bytes",
			ranges: [
				{
					start: {
						line: 1,
						character: 3,
					},
					end: {
						line: 1,
						character: 3,
					},
					direction: "ltr",
				},
			],
			type: "file",
			raw: `# Test

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi necessitatibus, at est repellat iusto veritatis repudiandae ipsam fugit, velit dolores fuga! Magnam reiciendis impedit commodi in quos blanditiis illum autem!

## Test 2

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi necessitatibus, at est repellat iusto veritatis repudiandae ipsam fugit, velit dolores fuga! Magnam reiciendis impedit commodi in quos blanditiis illum autem!

### Test 3

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi necessitatibus, at est repellat iusto veritatis repudiandae ipsam fugit, velit dolores fuga! Magnam reiciendis impedit commodi in quos blanditiis illum autem!

#### Test 4

Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi necessitatibus, at est repellat iusto veritatis repudiandae ipsam fugit, velit dolores fuga! Magnam reiciendis impedit commodi in quos blanditiis illum autem!

> A blockquote

##### Test 5

This is **bold**. This is *italic*. This is __bold__. This is _italic_. This is **_bold and italic_**. \`Code example\`.

![[Embed]]

[[https://i.picsum.photos/id/28/200/300.jpg?hmac=PtGtIbRuuZW5gEPGm0h1Y-koEaki3vffOYcq3TdSAlA]]

* Test the list

32. Ordered List
1. Ordered List 2
`,
		},
	],
};

export const editorSlice = createSlice({
	name: "editor",
	initialState,
	reducers: {
		openTab: (state, action: PayloadAction<string>) => {
			state.currentTab = action.payload;

			const currentTab = state.tabs.find((tab) => tab.path === action.payload) as OrdoFile;

			if (!currentTab || currentTab.raw == null) {
				// TODO: Read file, parse file, show file
			}

			if (!currentTab.data) {
				const processor = unified().use(remarkParse).use(remarkGfm).use(remarkWikiLink);
				const ast = processor.parse(currentTab?.raw);
				const transformed = unified().use(wikiLinkEmbeds).run(ast);

				currentTab.data = transformed;
			}
		},
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
});

export const { openTab, closeTab } = editorSlice.actions;

export const editorReducer = editorSlice.reducer;
