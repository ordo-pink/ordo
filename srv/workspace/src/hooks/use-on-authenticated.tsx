// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect } from "react"
import { __Auth$, useAuthStatus } from "../streams/auth"
import { getCommands } from "$streams/commands"
import { cmd } from "@ordo-pink/frontend-core"
import { Nullable } from "@ordo-pink/tau"

const commands = getCommands()

export const useOnAuthenticated = (auth$: Nullable<__Auth$>) => {
	const isAuthenticated = useAuthStatus()

	useEffect(() => {
		if (!isAuthenticated) return

		commands.emit<cmd.user.refreshInfo>("user.refresh")
		commands.emit<cmd.data.refreshRoot>("data.refresh-root")
		// eslint-disable-next-line react-hooks/exhaustive-deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated])
}
