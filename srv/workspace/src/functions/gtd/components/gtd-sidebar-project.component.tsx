// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import ActionListItem from "$components/action-list-item"
import Null from "$components/null"
import { useChildren } from "$hooks/use-children"
import { FSID } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { useDataByFSID } from "$hooks/use-data.hook"
import { useRouteParams } from "$hooks/use-route-params.hook"
import { BsCheckAll, BsListCheck } from "react-icons/bs"

type Props = { fsid: FSID }
export default function GTDSidebarProject({ fsid }: Props) {
	const { commands } = useSharedContext()
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
				<div className={`text-xs flex space-x-2 items-center`}>
					<div>
						{doneChildren.length < children.length ? (
							`${doneChildren.length}/${children.length}`
						) : (
							<BsCheckAll className="text-emerald-500 text-lg" />
						)}
					</div>
				</div>
			) : null}
		</ActionListItem>
	))
}
