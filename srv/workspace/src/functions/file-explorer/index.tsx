// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ComponentSpace } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import FileExplorerActivity from "./components/file-explorer-activity.component"
import FileExplorerIcon from "./components/file-explorer-icon.component"
import FileExplorerCardComponent from "./components/file-explorer-card.component"
import "./file-explorer.types"
import { BsFolder2Open } from "react-icons/bs"

export default function createFileExplorerFunction({ commands }: Functions.CreateFunctionParams) {
	commands.on<cmd.fileExplorer.goToFileExplorer>("file-explorer.go-to-file-explorer", () =>
		commands.emit<cmd.router.navigate>("router.navigate", "/fs"),
	)

	commands.on<cmd.fileExplorer.showInFileExplorer>(
		"file-explorer.show-in-file-explorer",
		({ payload }) => commands.emit<cmd.router.navigate>("router.navigate", `/fs/${payload}`),
	)

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "file-explorer.show-in-file-explorer",
		Icon: BsFolder2Open,
		readableName: "Открыть в менеджере файлов",
		type: "read",
		accelerator: "mod+shift+e",
		shouldShow: ({ payload }) =>
			payload && payload.fsid && !window.location.pathname.startsWith("/fs"),
		payloadCreator: ({ payload }) => payload.fsid,
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "file-explorer.go-to-file-explorer",
		Icon: BsFolder2Open,
		onSelect: () => {
			commands.emit<cmd.fileExplorer.goToFileExplorer>("file-explorer.go-to-file-explorer")
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
		},
		readableName: "Открыть файловый менеджер",
		accelerator: "mod+shift+e",
	})

	commands.emit<cmd.activities.add>("activities.add", {
		Component: FileExplorerComponent,
		name: "file-explorer",
		routes: ["/fs", "/fs/:fsid"],
		background: false,
	})
}

// TODO: Register widgets separately
type P = Extensions.ComponentProps
const FileExplorerComponent = ({ space }: P) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, FileExplorerIcon)
		.case(ComponentSpace.CARD, FileExplorerCardComponent)
		.case(ComponentSpace.WIDGET, FileExplorerCardComponent)
		.default(FileExplorerActivity)
