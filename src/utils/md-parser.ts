import { Color } from "@core/apprearance/colors";

export type MdLineType = "list" | "listItem" | "paragraph" | "blockquote" | "heading" | "HorizontalLine" | "br";

export type MdTokenType = "text" | "strong" | "link" | "wikiLink" | "wikiLinkEmbed" | "emphasis" | "delete";

export type MdStyle = {
	bold: boolean;
	italic: boolean;
	code: boolean;
	highlight: boolean;
	strikethrough: boolean;
	color: Color;
};

export type MdChar = {
	id: string;
	value: string;
	style: MdStyle;
};

export type MdToken = {
	id: string;
	value?: string;
	type: MdTokenType;
	children?: MdToken[];
};

export type MdLine = {
	id: string;
	number?: number;
	type: MdLineType;
	depth?: number;
	ordered?: boolean;
	children?: MdToken[];
};

export type MdDocument = {
	children: MdLine[];
};
