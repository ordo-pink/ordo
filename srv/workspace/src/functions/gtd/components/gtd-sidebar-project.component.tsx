// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import ActionListItem from "$components/action-list-item"
import Null from "$components/null"
import { useChildren } from "$hooks/use-children"
import { useData } from "$hooks/use-data"
import { FSID } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import FileIconComponent from "$functions/file-explorer/components/file-icon.component"
import { HiOutlineSparkles } from "react-icons/hi"

type Props = { fsid: FSID }
export default function GTDSidebarProject({ fsid }: Props) {
	const { commands, route } = useSharedContext()
	const data = useData(fsid)
	const children = useChildren(fsid)
	const pendingChildren = children.filter(child => !child.labels.includes("done"))

	return Either.fromNullable(data).fold(Null, data => (
		<ActionListItem
			onContextMenu={event =>
				commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: data })
			}
			large
			key={data.fsid}
			href={`/gtd/items/${data.fsid}`}
			Icon={() => <FileIconComponent plain={data} />}
			current={decodeURIComponent(route?.params?.item ?? "") === data.fsid}
			text={data.name}
		>
			{children.length > 0 ? (
				<div className={`text-xs flex space-x-2 items-center`}>
					<div>{pendingChildren.length > 0 ? pendingChildren.length : <HiOutlineSparkles />}</div>
				</div>
			) : null}
		</ActionListItem>
	))
}
