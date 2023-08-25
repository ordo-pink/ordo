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

const commands = getCommands()

export default function App() {
	const streams = useAppInit()
	useOnAuthenticated(streams.auth$)
	const exts = useExtensions()
	const auth = useSubscription(streams.auth$)

	const contextMenu = useSubscription(streams.contextMenu$)

	const hideContextMenu = () => contextMenu && commands.emit("context-menu.hide")

	useEffect(() => {
		if (!auth) return

		exts.activities.add("user", {
			Component: () => <UserPage auth={auth} />,
			Icon: BsPersonCircle,
			routes: ["/user"],
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
		.map(() => streams as { [K in keyof typeof streams]: NonNullable<(typeof streams)[K]> }) // TODO: Extract to tau
		.fold(Null, ({ contextMenu$, modal$, globalCommandPalette$, sidebar$ }) => (
			<div className="flex" onClick={hideContextMenu}>
				<ActivityBar sidebar$={sidebar$} commandPalette$={globalCommandPalette$} />
				<Workspace sidebar$={sidebar$} commandPalette$={globalCommandPalette$} />
				<ContextMenu menu$={contextMenu$} />
				<Modal modal$={modal$} />
			</div>
		))
}
