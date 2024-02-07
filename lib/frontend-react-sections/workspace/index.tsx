// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect } from "react"

import {
	useCommands,
	useStrictSubscription,
	useSubscription,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { currentActivity$ } from "@ordo-pink/frontend-stream-activities"
import { sidebar$ } from "@ordo-pink/frontend-stream-sidebar"

import WorkspaceWithSidebar from "./workspace-with-sidebar.component"
import WorkspaceWithoutSidebar from "./workspace-without-sidebar.component"

export default function Workspace() {
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	const activity = useSubscription(currentActivity$)
	const commands = useCommands()

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!activity && !sidebar.disabled) commands.emit<cmd.sidebar.disable>("sidebar.disable")
		if (activity) {
			if (activity.Sidebar && sidebar.disabled) commands.emit<cmd.sidebar.enable>("sidebar.enable")
			if (!activity.Sidebar && !sidebar.disabled)
				commands.emit<cmd.sidebar.disable>("sidebar.disable")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activity])

	return Either.fromNullable(sidebar)
		.chain(state => Either.fromBoolean(() => !state.disabled).map(() => sidebar$))
		.fold(
			() => <WorkspaceWithoutSidebar activity={activity} />,
			() => <WorkspaceWithSidebar activity={activity} />,
		)
}
