// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Extensions, ComponentSpace, Functions, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import FileExplorerActivity from "./components/file-explorer-activity.component"
import FileExplorerIcon from "./components/file-explorer-icon.component"
import FileExplorerCardComponent from "./components/file-explorer-card.component"
import { PlainData } from "@ordo-pink/data"

type openInFileExplorer = { name: "file-explorer.go-to"; payload: { data: PlainData } }
type openRootInFileExplorer = { name: "file-explorer.open-root" }

export default function createFileExplorerFunction({ commands }: Functions.CreateFunctionParams) {
	commands.on<openInFileExplorer>("file-explorer.go-to", ({ payload }) =>
		commands.emit<cmd.router.navigate>("router.navigate", `/fs${payload}`),
	)

	commands.on<openRootInFileExplorer>("file-explorer.open-root", () =>
		commands.emit<cmd.router.navigate>("router.navigate", "/fs"),
	)

	commands.emit<cmd.activities.add>("activities.add", {
		Component: FileExplorerComponent,
		name: "file-explorer",
		routes: ["/fs", "/fs/:fsid"],
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
