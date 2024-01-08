// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either"
import { useAppInit } from "$hooks/use-app-init"
import { getCommands } from "$streams/commands"
import { useStrictSubscription, useSubscription } from "$hooks/use-subscription"
import { createContext, useContext, useEffect } from "react"
import {
	Commands,
	Extensions,
	Router,
	User,
	__useSharedContextInit,
} from "@ordo-pink/frontend-core"
import Notifications from "$components/notifications/notifications.component"
import ActivityBar from "$components/activity-bar/activity-bar"
import ContextMenu from "$components/context-menu/context-menu"
import Workspace from "$components/workspace"
import Modal from "$components/modal"
import Null from "$components/null"
import { AllKeysRequired, Nullable } from "@ordo-pink/tau"
import { PlainData } from "@ordo-pink/data"
import { useUser } from "$streams/auth"
import BackgroundTaskIndicator from "$components/background-task-indicator.component"

// TODO: Remove useAppInit
const commands = getCommands()
const SharedContext = createContext<{
	data: Nullable<PlainData[]>
	route: Nullable<Router.Route>
	user: Nullable<User.User>
	commands: Commands.Commands
	fileAssociations: Extensions.FileAssociation[]
	workspaceSplitSize: [number, number]
}>({
	data: null,
	route: null,
	user: null,
	commands,
	fileAssociations: [],
	workspaceSplitSize: [0, 100],
})

export default function App() {
	const streams = useAppInit()
	const data = useSubscription(streams.data$)
	const auth = useSubscription(streams.auth$)
	const fileAssociations = useStrictSubscription(streams.fileAssociations$, [])
	const user = useUser()
	const currentRoute = useSubscription(streams.currentRoute$)
	const sidebar = useSubscription(streams.sidebar$)
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
		import("./functions/links").then(f => f.default({ commands, data$: streams.data$ }))
		import("./functions/editor").then(f => f.default({ commands, data$: streams.data$ }))
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
		.chain(() => Either.fromNullable(streams.fileAssociations$))
		.map(() => streams as AllKeysRequired<typeof streams>)
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
				<SharedContext.Provider
					value={{
						data: data,
						route: currentRoute,
						commands,
						fileAssociations,
						workspaceSplitSize: sidebar && !sidebar.disabled ? sidebar.sizes : [0, 100],
						user: user.fold(
							() => null,
							u => u, // TODO: Avoid adding current user to shared context
						),
					}}
				>
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
						<BackgroundTaskIndicator />
					</div>
				</SharedContext.Provider>
			),
		)
}
