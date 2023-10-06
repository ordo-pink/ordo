// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either/mod"
import { useAppInit } from "$hooks/use-app-init"
import { getCommands } from "$streams/commands"
import { useSubscription } from "$hooks/use-subscription"
import { createContext, useContext, useEffect } from "react"
import { Commands, Router, __useSharedContextInit, cmd } from "@ordo-pink/frontend-core"
import Notifications from "$components/notifications/notifications.component"
import ActivityBar from "$components/activity-bar/activity-bar"
import ContextMenu from "$components/context-menu/context-menu"
import Workspace from "$components/workspace"
import Modal from "$components/modal"
import Null from "$components/null"
import { AllKeysRequired, Nullable } from "@ordo-pink/tau"
import { PlainData } from "@ordo-pink/data"

// TODO: Remove useAppInit
const commands = getCommands()
const SharedContext = createContext<{
	data: Nullable<PlainData[]>
	route: Nullable<Router.Route>
	commands: Commands.Commands
}>({ data: null, route: null, commands })

export default function App() {
	const streams = useAppInit()
	const data = useSubscription(streams.data$)
	const auth = useSubscription(streams.auth$)
	const currentRoute = useSubscription(streams.currentRoute$)
	__useSharedContextInit(SharedContext, useContext)

	const contextMenu = useSubscription(streams.contextMenu$)

	const hideContextMenu = () => contextMenu && commands.emit<cmd.ctxMenu.hide>("context-menu.hide")

	useEffect(() => {
		if (!auth) return

		commands.emit<cmd.user.refreshInfo>("user.refresh")
		commands.emit<cmd.data.refreshRoot>("data.refresh-root")

		import("./functions/home").then(f =>
			f.default({ commands, data$: streams.data$, activities$: streams.activities$ }),
		)
		import("./functions/file-explorer").then(f => f.default({ commands, data$: streams.data$ }))
		import("./functions/gtd").then(f => f.default({ commands, data$: streams.data$ }))
		import("./functions/user").then(f =>
			f.default({ commands, data$: streams.data$, auth$: streams.auth$ }),
		)

		// TODO: Enable user functions
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth === null])

	return Either.fromNullable(streams)
		.chain(() => Either.fromNullable(streams.contextMenu$))
		.chain(() => Either.fromNullable(streams.data$))
		.chain(() => Either.fromNullable(streams.modal$))
		.chain(() => Either.fromNullable(streams.globalCommandPalette$))
		.chain(() => Either.fromNullable(streams.sidebar$))
		.chain(() => Either.fromNullable(streams.notification$))
		.chain(() => Either.fromNullable(streams.activities$))
		.chain(() => Either.fromNullable(streams.currentActivity$))
		.chain(() => Either.fromNullable(streams.currentRoute$))
		.map(() => streams as AllKeysRequired<typeof streams>) // TODO: Extract to tau
		.fold(
			Null,
			({
				contextMenu$,
				modal$,
				globalCommandPalette$,
				sidebar$,
				notification$,
				activities$,
				currentActivity$,
			}) => (
				<SharedContext.Provider value={{ data: data, route: currentRoute, commands }}>
					<div className="flex" onClick={hideContextMenu}>
						<ActivityBar
							sidebar$={sidebar$}
							currentActivity$={currentActivity$}
							commandPalette$={globalCommandPalette$}
							activities$={activities$}
						/>
						<Workspace
							sidebar$={sidebar$}
							commandPalette$={globalCommandPalette$}
							currentActivity$={currentActivity$}
						/>
						<ContextMenu menu$={contextMenu$} />
						<Modal modal$={modal$} />
						<Notifications notification$={notification$} />
					</div>
				</SharedContext.Provider>
			),
		)
}
