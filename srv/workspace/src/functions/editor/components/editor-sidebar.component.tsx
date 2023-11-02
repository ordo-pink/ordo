// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import ActionListItem from "$components/action-list-item"
import { Loading } from "$components/loading/loading"
import { useRouteParams } from "$hooks/use-route-params.hook"
import { FSID } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { BsFileEarmark } from "react-icons/bs"

export default function EditorSidebar() {
	const { data } = useSharedContext()
	const { fsid } = useRouteParams<{ fsid: FSID }>()

	return Either.fromNullable(data).fold(Loading, data => (
		<div>
			{data.map(item => (
				<ActionListItem
					key={item.fsid}
					Icon={BsFileEarmark}
					href={`/editor/${item.fsid}`}
					current={fsid === item.fsid}
					text={item.name}
				/>
			))}
		</div>
	))
}
