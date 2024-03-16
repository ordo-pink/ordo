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

import { BsCheckAll, BsListCheck } from "react-icons/bs"

import {
	useChildren,
	useCommands,
	useDataByFSID,
	useRouteParams,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { FSID } from "@ordo-pink/data"

import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"
import Null from "@ordo-pink/frontend-react-components/null"

type Props = { fsid: FSID }
export default function GTDSidebarProject({ fsid }: Props) {
	const commands = useCommands()
	const data = useDataByFSID(fsid)
	const children = useChildren(fsid)
	const { fsid: routeFSID = "" } = useRouteParams<{ fsid: FSID }>()
	const doneChildren = children.filter(child => child.labels.includes("done"))

	return Either.fromNullable(data).fold(Null, data => (
		<ActionListItem
			onContextMenu={event =>
				commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: data })
			}
			large
			key={data.fsid}
			href={`/gtd/projects/${data.fsid}`}
			Icon={BsListCheck}
			current={decodeURIComponent(routeFSID) === data.fsid}
			text={data.name}
		>
			{children.length > 0 ? (
				<div className="flex items-center space-x-2 text-xs">
					<div>
						{doneChildren.length < children.length ? (
							`${doneChildren.length}/${children.length}`
						) : (
							<BsCheckAll className="text-lg text-emerald-500" />
						)}
					</div>
				</div>
			) : null}
		</ActionListItem>
	))
}
