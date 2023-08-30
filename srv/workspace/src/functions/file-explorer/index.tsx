// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { memo } from "react"
import { Activity, ComponentSpace, Functions, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import FileExplorerActivityComponent from "./components/file-explorer-activity.component"
import FileExplorerIcon from "./components/file-explorer-icon.component"
import FileExplorerCardComponent from "./components/file-explorer-card.component"
import { BsFolderCheck, BsFolderMinus, BsFolderPlus } from "react-icons/bs"
import { BehaviorSubject } from "rxjs"
import { Directory, DirectoryPath, DirectoryUtils, FSEntity } from "@ordo-pink/datautil"

type openInFileExplorer = { name: "file-explorer.go-to"; payload: DirectoryPath }
type openRootInFileExplorer = { name: "file-explorer.open-root" }

// TODO: Provide commands and queries via the import
export default function createFileExplorerFunction({
	commands,
	metadata$,
}: Functions.CreateFunctionParams) {
	commands.on<openInFileExplorer>("file-explorer.go-to", ({ payload }) =>
		commands.emit<cmd.router.navigate>("router.navigate", `/fs${payload}`),
	)
	commands.on<openRootInFileExplorer>("file-explorer.open-root", () =>
		commands.emit<cmd.router.navigate>("router.navigate", "/fs"),
	)

	commands.emit<cmd.contextMenu.add>("context-menu.add", {
		commandName: "data.show-create-directory-modal",
		Icon: BsFolderPlus,
		readableName: "Create directory",
		shouldShow: ({ payload }) => {
			console.log(">>>>>>>>>>>>", payload)
			return payload && DirectoryUtils.isDirectory(payload)
		},
		type: "create",
		accelerator: "meta+shift+n",
	})

	commands.emit<cmd.contextMenu.add>("context-menu.add", {
		commandName: "data.show-remove-directory-modal",
		Icon: BsFolderMinus,
		readableName: "Remove directory",
		shouldShow: ({ payload }) =>
			payload && DirectoryUtils.isDirectory(payload) && payload.path !== "/",
		type: "delete",
	})

	commands.emit<cmd.activities.add>("activities.add", {
		Component: props => <FSActivity {...props} />,
		name: "file-explorer",
		routes: ["/fs", "/fs/:path*"],
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "file-explorer.open-in-file-explorer",
		readableName: "Go to File Explorer",
		accelerator: "mod+shift+e",
		Icon: FileExplorerIcon,
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<openRootInFileExplorer>("file-explorer.open-root")
		},
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "file-explorer.choose-directory",
		readableName: "Open directory in File Explorer...",
		Icon: BsFolderCheck,
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.commandPalette.show>(
				"command-palette.show",
				(metadata$ as BehaviorSubject<FSEntity[]>).value
					.filter(item => DirectoryUtils.isDirectory(item) && item.path !== "/")
					.map(item => ({
						id: item.path,
						readableName: `Open ${DirectoryUtils.getReadableName((item as Directory).path)}`,
						onSelect: () => {
							commands.emit<cmd.commandPalette.hide>("command-palette.hide")
							commands.emit<openInFileExplorer>("file-explorer.go-to", (item as Directory).path)
						},
					})),
			)
		},
	})
}

type P = Activity.ComponentProps
const FileExplorerComponent = ({ space, commands }: P) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <FileExplorerIcon />)
		.case(ComponentSpace.CARD, FileExplorerCardComponent)
		.case(ComponentSpace.WIDGET, FileExplorerCardComponent)
		.default(() => <FileExplorerActivityComponent commands={commands} />)

const FSActivity = memo(FileExplorerComponent, (prev, next) => prev.space === next.space)
