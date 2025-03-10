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

import type { Range } from "@ordo-pink/tau"

import type { TextNodeStyle } from "./rte.constants"

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
		value: string
		styles: TextNodeStyle[]
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

export type TRTEBlockquoteNode = TRTENode<
	"bq",
	{
		children: (TRTETextNode | TRTECodeNode)[]
		cite?: string
	}
>

export type TRTEEmbedNode = TRTENode<
	"embed",
	{
		internal: boolean
		target: string
	}
>

export type TRTEHeaderNode = TRTENode<
	"h",
	{
		level: Range<1, 7>
		children: (TRTETextNode | TRTECodeNode)[]
	}
>

export type TRTESelection = {
	block: number
	inline: number
	anchor: number
	focus: number
}

export type TRTEContent = TRTENode[]

export type TRTEState = {
	content: TRTEContent
	selection: TRTESelection
	is_editable: boolean
	is_embedded: boolean
	quick_menu: { x: number; y: number } | null
}
