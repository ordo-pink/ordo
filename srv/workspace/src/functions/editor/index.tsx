// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ComponentSpace } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { BsFileEarmark, BsLayoutTextSidebarReverse } from "react-icons/bs"
import EditorSidebar from "./components/editor-sidebar.component"
import EditorWorkspace from "./components/editor-workspace.component"
import "./editor.types"
import { PlainData } from "@ordo-pink/data"

export default function createEditorFunction({ commands, data$ }: Functions.CreateFunctionParams) {
	commands.emit<cmd.activities.add>("activities.add", {
		Component: ({ space }) => <Component space={space} commands={commands} />,
		Sidebar: EditorSidebar,
		name: "editor",
		routes: ["/editor", "/editor/:fsid"],
		background: false,
	})

	commands.on<cmd.editor.goToEditor>("editor.go-to-editor", () =>
		commands.emit<cmd.router.navigate>("router.navigate", "/editor"),
	)

	commands.on<cmd.editor.open>("editor.open", ({ payload }) =>
		commands.emit<cmd.router.navigate>("router.navigate", `/editor/${payload}`),
	)

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "editor.go-to-editor",
		accelerator: "mod+e",
		readableName: "Перейти в редактор",
		Icon: BsLayoutTextSidebarReverse,
		onSelect: () => {
			commands.emit<cmd.editor.goToEditor>("editor.go-to-editor")
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
		},
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "editor.open",
		Icon: BsLayoutTextSidebarReverse,
		readableName: "Открыть в редакторе",
		type: "read",
		accelerator: "mod+e",
		shouldShow: ({ payload }) =>
			payload && payload.fsid && !window.location.pathname.startsWith("/editor"),
		payloadCreator: ({ payload }) => payload.fsid,
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "editor.open",
		accelerator: "mod+p",
		readableName: "Открыть в редакторе...",
		Icon: BsLayoutTextSidebarReverse,
		onSelect: () => {
			const data = (data$ as any).value as PlainData[]

			commands.emit<cmd.commandPalette.show>("command-palette.show", {
				multiple: false,
				items: data.map(
					item =>
						({
							id: item.fsid,
							readableName: item.name,
							Icon: BsFileEarmark,
							onSelect: () => {
								commands.emit<cmd.editor.open>("editor.open", item.fsid)
								commands.emit<cmd.commandPalette.hide>("command-palette.hide")
							},
						} satisfies Client.CommandPalette.Item),
				),
			})
		},
	})
}

const Component = ({ space }: Extensions.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <BsLayoutTextSidebarReverse />)
		.default(() => <EditorWorkspace />)
