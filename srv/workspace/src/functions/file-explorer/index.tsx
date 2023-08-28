// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { memo } from "react"
import { Activity, ComponentSpace, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { createOrdoFunction } from "$utils/create-function.util"
import FileExplorerActivityComponent from "./components/file-explorer-activity.component"
import FileExplorerIcon from "./components/file-explorer-icon.component"
import FileExplorerCardComponent from "./components/file-explorer-card.component"

// TODO: Provide commands and queries via the import
export default function createFileExplorerFunction() {
	return createOrdoFunction(commands => {
		commands.emit<cmd.activities.add>("activities.add", {
			Component: props => <FSActivity {...props} />,
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

type P = Activity.ComponentProps
const FileExplorerComponent = ({ space, commands }: P) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <FileExplorerIcon />)
		.case(ComponentSpace.WIDGET, FileExplorerCardComponent)
		.case(ComponentSpace.WIDGET, FileExplorerCardComponent)
		.default(() => <FileExplorerActivityComponent commands={commands} />)

const FSActivity = memo(FileExplorerComponent, (prev, next) => prev.space === next.space)
