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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

type TOrdoTextEditorNode = {
	type: string
	value: string
}

export const RichText = (
	metadata: Ordo.Metadata.Instance,
	content: Ordo.Content.Instance,
	ctx: Ordo.CreateFunction.Params,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))

		const fsid = metadata.get_fsid()
		const content_type = metadata.get_type()

		const state: TOrdoTextEditorNode[] = content ? JSON.parse(content as string) : []

		const commands = use(MaokaOrdo.Jabs.Commands)

		use(MaokaJabs.set_class("p-2 size-full min-h-screen"))

		const handle_line_change = (value: string, index: number) => {
			if (!state[index]) state[index] = { type: "p", value }
			else state[index].value = value

			commands.emit("cmd.content.set", { fsid, content_type, content: JSON.stringify(state) })
		}

		// TODO Extract node type to enum
		return () => [
			...state.map((node, index) => Line(node, index, handle_line_change)),
			Line({ type: "paragraph", value: "" }, state.length, handle_line_change),
		]
	})

const Line = (
	node: TOrdoTextEditorNode,
	index: number,
	on_change: (value: string, index: number) => void,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("outline-none"))
		use(MaokaJabs.set_attribute("contenteditable", "true"))
		use(
			MaokaJabs.listen("oninput", event => {
				on_change((event.target as any).innerText, index)
			}),
		)

		return () => node.value
	})
