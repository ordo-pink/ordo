// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Activity, ComponentSpace, cmd } from "@ordo-pink/frontend-core"
import { memo } from "react"
import { Switch } from "@ordo-pink/switch"
import { BsFolder2Open } from "react-icons/bs"
import { createOrdoFunction } from "$utils/create-function.util"
import FileExplorerActivityComponent from "./components/file-explorer-activity.component"

// TODO: Provide commands and queries via the import
export default function createFileExplorerFunction() {
	return createOrdoFunction(commands => {
		commands.emit<cmd.activities.add>("activities.add", {
			Component: FSActivity,
			name: "file-explorer",
			routes: ["/fs", "/fs/path*"],
		})

		commands.emit<cmd.commandPalette.add>("command-palette.add", {
			id: "file-explorer.navigate",
			readableName: "Go to File Explorer",
			accelerator: "mod+shift+e",
			Icon: FileExplorerIcon,
			onSelect: () => commands.emit<cmd.router.navigate>("router.navigate", "/fs"),
		})
	})
}

const FileExplorerComponent = ({ space, commands }: Activity.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <FileExplorerIcon />)
		.default(() => <FileExplorerActivityComponent commands={commands} />)

const FSActivity = memo(FileExplorerComponent, (prev, next) => prev.space === next.space)

const FileExplorerIcon = () => <BsFolder2Open />
