// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either/mod"
import { useOnAuthenticated } from "$hooks/use-on-authenticated"
import { useAppInit } from "$hooks/use-app-init"
import ActivityBar from "$components/activity-bar/activity-bar"
import ContextMenu from "$components/context-menu/context-menu"
import Workspace from "$components/workspace"
import Modal from "$components/modal"
import Null from "$components/null"
import { getCommands } from "$streams/commands"
import { useSubscription } from "$hooks/use-subscription"
import { useEffect } from "react"
import { useExtensions } from "$streams/extensions"
import { BsPersonCircle } from "react-icons/bs"
import UserPage from "./pages/user.page"
import { cmd } from "@ordo-pink/frontend-core"
import Notifications from "$components/notifications/notifications.component"

const commands = getCommands()

export default function App() {
	const streams = useAppInit()
	const exts = useExtensions()
	const auth = useSubscription(streams.auth$)

	useOnAuthenticated(streams.auth$)

	const contextMenu = useSubscription(streams.contextMenu$)

	const hideContextMenu = () =>
		contextMenu && commands.emit<cmd.contextMenu.hide>("context-menu.hide")

	useEffect(() => {
		if (!auth) return

		commands.emit<cmd.commandPalette.add>("command-palette.add", {
			id: "user.go-to-user",
			readableName: "Go to Account",
			Icon: BsPersonCircle,
			onSelect: () => commands.emit<cmd.router.navigate>("router.navigate", "/user"),
		})

		exts.activities.add("user", {
			Component: () => <UserPage auth={auth} />,
			Icon: BsPersonCircle,
			routes: ["/user"],
			background: true,
		})

		return () => {
			exts.activities.remove("user")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [auth === null])

	return Either.fromNullable(streams)
		.chain(() => Either.fromNullable(streams.contextMenu$))
		.chain(() => Either.fromNullable(streams.modal$))
		.chain(() => Either.fromNullable(streams.globalCommandPalette$))
		.chain(() => Either.fromNullable(streams.sidebar$))
		.chain(() => Either.fromNullable(streams.notification$))
		.map(() => streams as { [K in keyof typeof streams]: NonNullable<(typeof streams)[K]> }) // TODO: Extract to tau
		.fold(Null, ({ contextMenu$, modal$, globalCommandPalette$, sidebar$, notification$ }) => (
			<div className="flex" onClick={hideContextMenu}>
				<ActivityBar sidebar$={sidebar$} commandPalette$={globalCommandPalette$} />
				<Workspace sidebar$={sidebar$} commandPalette$={globalCommandPalette$} />
				<ContextMenu menu$={contextMenu$} />
				<Modal modal$={modal$} />
				<Notifications notification$={notification$} />
			</div>
		))
}
