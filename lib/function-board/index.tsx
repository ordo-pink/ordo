/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Root, createRoot } from "react-dom/client"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { create_function } from "@ordo-pink/core"

import Flow from "./src/components/board.component.tsx"

export default create_function(
	"pink.ordo.board",
	{
		commands: [
			"cmd.application.context_menu.add",
			"cmd.application.context_menu.show",
			"cmd.content.set",
			"cmd.functions.file_associations.register",
			"cmd.metadata.show_create_modal",
		],
		queries: [],
	},
	ctx => {
		let root: Root | undefined

		const render = (params: Ordo.FileAssociation.RenderParams) =>
			Maoka.create("div", ({ element, use }) => {
				use(MaokaJabs.set_class("h-full"))
				use(
					MaokaDOM.Jabs.onmount(() => {
						if (MaokaDOM.is_maoka_dom_element(element)) {
							if (!root) root = createRoot(element)
							else root.unmount()

							root.render(<Flow commands={ctx.commands} {...params} />)
						}
					}),
				)
			})

		ctx.commands.on("cmd.board.context_menu.show_create_file", fsid =>
			ctx.commands.emit("cmd.metadata.show_create_modal", fsid),
		)

		ctx.commands.emit("cmd.functions.file_associations.register", {
			name: "pink.ordo.board",
			render,
			types: [
				{
					description: "t.board.file_association.description",
					name: "board/ordo",
					readable_name: "t.board.file_association.readable_name",
				},
			],
		})
	},
)
