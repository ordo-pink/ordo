// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import ActionListItem from "$components/action-list-item"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { BsTag, BsTags } from "react-icons/bs"

export default function LinksSidebar() {
	const { route, data } = useSharedContext()
	const labels = Array.from(new Set(data?.flatMap(item => item.labels) ?? []))

	return (
		<div className="my-6">
			<ActionListItem
				Icon={BsTags}
				current={!!route && route.path === "/links"}
				text="All labels"
				href="/links"
			/>

			{labels.map(label => (
				<ActionListItem
					key={label}
					Icon={BsTag}
					current={!!route && !!route.params && route.params.label === label}
					text={label}
					href={`/links/${label}`}
				>
					<div className="text-xs text-neutral-500">
						{data?.filter(item => item.labels.includes(label)).length}
					</div>
				</ActionListItem>
			))}
		</div>
	)
}
