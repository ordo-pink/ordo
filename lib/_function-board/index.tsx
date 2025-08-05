/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Root, createRoot } from "react-dom/client"
import { ReactFlowProvider } from "@xyflow/react"

import { Maoka } from "@ordo-pink/oss-maoka/index.ts"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { create_function } from "@ordo-pink/_core/index.ts"

import Flow from "./src/components/board.component.tsx"
import { board_context } from "./src/board.context.ts"

export default create_function(
	"pink.ordo.board",
	{
		commands: [
			"cmd.application.command_palette.show",
			"cmd.application.context_menu.add",
			"cmd.application.context_menu.show",
			"cmd.board.context_menu.create_node",
			"cmd.content.set",
			"cmd.functions.file_associations.register",
			"cmd.metadata.create",
			"cmd.metadata.remove",
			"cmd.metadata.show_create_modal",
		],
		queries: [
			"metadata.get",
			"metadata.get_by_name",
			"metadata.get_children",
			"metadata.get_by_fsid",
			"metadata.get_outgoing_links",
			"metadata.has_children",
			"metadata.get_incoming_links",
			"content.get",
			"metadata.$",
		],
	},
	ctx => {
		let root: Root | undefined

		const render = (params: Ordo.FileAssociation.RenderParams) =>
			Maoka.create("div", ({ element, use }) => {
				use(maoka_jabs.set_class("h-full"))
				use(
					MaokaDOM.Jabs.onmount(() => {
						if (MaokaDOM.is_maoka_dom_element(element)) {
							if (!root) {
								root = createRoot(element)
							} else {
								root.unmount()
								root = undefined
								root = createRoot(element)
							}

							root.render(
								<ReactFlowProvider>
									<BoardContextProvider value={ctx}>
										<Flow {...params} />
									</BoardContextProvider>
								</ReactFlowProvider>,
							)
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

// --- Internal ---

const BoardContextProvider = board_context.Provider
