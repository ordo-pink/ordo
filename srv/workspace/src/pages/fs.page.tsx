// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getCommands } from "$streams/commands"
import { cmd } from "@ordo-pink/frontend-core"
import { useEffect } from "react"

const commands = getCommands()

export default function FsPage() {
	useEffect(() => {
		commands.emit<cmd.sidebar.enable>("sidebar.enable")
	}, [])

	return (
		<div>
			<h1>Hello</h1>
		</div>
	)
}
