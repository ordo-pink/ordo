// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Descendant } from "slate"

export const SHORTCUTS = {
	"*": "list-item",
	"-": "list-item",
	"+": "list-item",
	"1": "number-list-item",
	"2": "number-list-item",
	"3": "number-list-item",
	"4": "number-list-item",
	"5": "number-list-item",
	"6": "number-list-item",
	"7": "number-list-item",
	"8": "number-list-item",
	"9": "number-list-item",
	"0": "number-list-item",
	">": "block-quote",
	'"': "block-quote", // eslint-disable-line quotes
	"#": "heading-1",
	"##": "heading-2",
	"###": "heading-3",
	"####": "heading-4",
	"#####": "heading-5",
	"№": "heading-1",
	"№№": "heading-2",
	"№№№": "heading-3",
	"№№№№": "heading-4",
	"№№№№№": "heading-5",
	"()": "check-list-item",
	"[]": "check-list-item",
} as const

type TDefaultNodes = "ordered-list" | "unordered-list" | "paragraph" | "callout"

export type TNodeType =
	| (typeof SHORTCUTS extends { [key: string]: infer U } ? U : never)
	| TDefaultNodes

export const EMPTY_EDITOR_CHILDREN = [
	{ type: "paragraph", children: [{ text: "" }] },
] as unknown as Descendant[]
