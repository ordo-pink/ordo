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

import type { TextNodeStyles } from "./src/rich-text.constants"

export type TOrdoRTENode<
	$TType extends string = string,
	$TParams extends Record<string, unknown> = Record<string, unknown>,
> = $TParams & { type: $TType }

export type TOrdoRTEParent<
	$TType extends string = string,
	$TParams extends Record<string, unknown> = Record<string, unknown>,
	$TChildren extends any[] = any[],
> = TOrdoRTENode<$TType, $TParams & { children: $TChildren }>

type ZeroToN<$TNumber extends number, $TAccumulator extends number[] = []> = $TAccumulator["length"] extends $TNumber
	? $TAccumulator[number]
	: ZeroToN<$TNumber, [...$TAccumulator, $TAccumulator["length"]]>

type Range<$TStart extends number, $TEnd extends number> = Exclude<ZeroToN<$TEnd>, ZeroToN<$TStart>>

export type TOrdoRTETextNode = TOrdoRTENode<"text", { value: string; styles: TextNodeStyles[] }>

export type TOrdoRTECodeNode = TOrdoRTENode<"code", { value: string }>

export type TOrdoRTEParagraphNode = TOrdoRTENode<"p", { children: (TOrdoRTETextNode | TOrdoRTECodeNode)[] }>

export type TOrdoRTEEmbedNode = TOrdoRTENode<"embed", { internal: boolean; target: string }>

export type TOrdoRTEHeaderNode = TOrdoRTENode<"h", { level: Range<1, 7>; children: TextNodeStyles[] }>

export type TEditorSelection = { block: number; inline: number; anchor: number; focus: number }

export type TEditorContent = TOrdoRTENode[]

export type TEditorState = {
	content: TEditorContent
	selection: TEditorSelection
	is_editable: boolean
	is_embedded: boolean
}
