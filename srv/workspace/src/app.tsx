// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either"
import { useAppInit } from "$hooks/use-app-init"
import { getCommands } from "$streams/commands"
import { useStrictSubscription, useSubscription } from "$hooks/use-subscription"
import { createContext, useContext, useEffect } from "react"
import { __useSharedContextInit } from "@ordo-pink/core"
import Notifications from "$components/notifications.component"
import ActivityBar from "$components/activity-bar/activity-bar"
import ContextMenu from "$components/context-menu/context-menu.component"
import Workspace from "$components/workspace"
import Modal from "$components/modal.component"
import Null from "$components/null"
import { AllKeysRequired } from "@ordo-pink/tau"
import { PlainData } from "@ordo-pink/data"
import { useUser } from "$streams/auth"
import BackgroundTaskIndicator from "$components/background-task-indicator.component"

const commands = getCommands()
const SharedContext = createContext<{
	data: PlainData[] | null
	route: Client.Router.Route | null
	user: User.User | null
	commands: Client.Commands.Commands
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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth === null])

	return Either.fromNullable(streams)
		.chain(() => Either.fromNullable(streams.data$))
		.chain(() => Either.fromNullable(streams.globalCommandPalette$))
		.chain(() => Either.fromNullable(streams.sidebar$))
		.chain(() => Either.fromNullable(streams.activities$))
		.chain(() => Either.fromNullable(streams.currentActivity$))
		.chain(() => Either.fromNullable(streams.currentRoute$))
		.chain(() => Either.fromNullable(streams.fileAssociations$))
		.map(() => streams as AllKeysRequired<typeof streams>)
		.fold(Null, ({ globalCommandPalette$, sidebar$, activities$, currentActivity$ }) => (
			<SharedContext.Provider
				value={{
					data: data,
					route: currentRoute,
					commands,
					fileAssociations,
					workspaceSplitSize: sidebar && !sidebar.disabled ? sidebar.sizes : [0, 100],
					user: user.fold(
						() => null,
						u => u,
					),
				}}
			>
				<div className="flex">
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
					<ContextMenu />
					<Modal />
					<Notifications />
					<BackgroundTaskIndicator />
				</div>
			</SharedContext.Provider>
		))
}
