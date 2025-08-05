/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { Range } from "@ordo-pink/_tau"

import type { CalloutType, TextNodeStyle } from "./rte.constants"

export type TRTENode<
	$TType extends string = string,
	$TParams extends Record<string, unknown> = Record<string, unknown>,
> = $TParams & {
	type: $TType
}

export type TRTEParent<
	$TType extends string = string,
	$TParams extends Record<string, unknown> = Record<string, unknown>,
	$TChildren extends any[] = any[],
> = TRTENode<
	$TType,
	$TParams & {
		children: $TChildren
	}
>

export type TRTETextNode = TRTENode<
	"text",
	{
		styles: TextNodeStyle[]
		value: string
	}
>

export type TRTECodeNode = TRTENode<
	"code",
	{
		value: string
	}
>

export type TRTEParagraphNode = TRTENode<
	"p",
	{
		children: (TRTETextNode | TRTECodeNode)[]
	}
>

export type TRTEIncomingLinksNode = TRTENode<"incoming_links">

export type TRTEBlockquoteNode = TRTENode<
	"bq",
	{
		children: (TRTETextNode | TRTECodeNode)[]
		cite?: string
	}
>

export type TRTECalloutNode = TRTENode<
	"callout",
	{
		callout_type: CalloutType
		children: (TRTETextNode | TRTECodeNode)[]
		title?: string
		emoji?: string
	}
>

export type TRTEEmbedNode = TRTENode<
	"embed",
	{
		fsid?: Ordo.Metadata.FSID
	}
>

export type TRTEHeaderNode = TRTENode<
	"h",
	{
		children: (TRTETextNode | TRTECodeNode)[]
		level: Range<1, 7>
	}
>

export type TRTESelection = {
	anchor: number
	block: number
	focus: number
	inline: number
}

export type TRTEContent = TRTENode[]

export type TRTEEditorState = {
	content: TRTEContent
	selection: TRTESelection
}

export type TRTEState = {
	focus?: Ordo.Metadata.FSID
	state: Record<Ordo.Metadata.FSID, TRTEEditorState>
}

export type TBlockNodeParams<$TNode> = {
	metadata: Ordo.Metadata.Instance
	block_index: number
	node: $TNode
	is_editable: boolean
	is_embedded: boolean
}

export type TInlineNodeParams<$TNode> = TBlockNodeParams<$TNode> & {
	inline_index: number
}
