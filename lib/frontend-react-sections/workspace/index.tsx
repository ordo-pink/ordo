// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
