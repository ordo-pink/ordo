// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Null from "$components/null"
import { useMetadata } from "$streams/auth"
import { Activity, ComponentSpace, cmd } from "@ordo-pink/frontend-core"
import { memo, useEffect } from "react"
import { Switch } from "@ordo-pink/switch"
import { BsFolder2Open } from "react-icons/bs"
import { createExtension } from "$utils/create-extension.util"

const FsPage = ({ space, commands }: Activity.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <Icon />)
		.default(() => <Workspace commands={commands} />)

const FSActivity = memo(FsPage, (prev, next) => prev.space === next.space)

export default () =>
	createExtension(commands => {
		commands.emit<cmd.activities.add>("activities.add", {
			Component: FSActivity,
			name: "ordo.file-explorer",
			routes: ["/fs", "/fs/path*"],
		})

		commands.emit<cmd.commandPalette.add>("command-palette.add", {
			id: "go-to-file-explorer",
			readableName: "Go to File Explorer",
			accelerator: "mod+shift+e",
			onSelect: () => commands.emit<cmd.router.navigate>("router.navigate", "/fs"),
		})
	})

const Icon = () => <BsFolder2Open />

const Workspace = ({ commands }: Pick<Activity.ComponentProps, "commands">) => {
	const root = useMetadata() // TODO: Move metadata to separate stream

	useEffect(() => {
		commands.emit<cmd.sidebar.enable>("sidebar.enable")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return root.fold(Null, content => content.map(item => <div key={item.fsid}>{item.path}</div>))
}
