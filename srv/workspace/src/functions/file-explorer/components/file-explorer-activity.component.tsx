// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Null from "$components/null"
import { Either } from "@ordo-pink/either"
import { Activity, cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { useEffect } from "react"

export default function FileExplorerActivityComponent({
	commands,
}: Pick<Activity.ComponentProps, "commands">) {
	const { metadata } = useSharedContext() // TODO: Move metadata to separate stream

	useEffect(() => {
		commands.emit<cmd.sidebar.enable>("sidebar.enable")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return Either.fromNullable(metadata).fold(Null, content =>
		content.map(item => <div key={item.path}>{item.path}</div>),
	)
}
