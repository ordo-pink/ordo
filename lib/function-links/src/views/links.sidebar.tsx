import { BsTag, BsTags } from "react-icons/bs"

import { useData, useDataLabels, useRouteParams } from "@ordo-pink/frontend-react-hooks"

import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"

export default function LinksSidebar() {
	const { label: currentLabel } = useRouteParams<{ label: string }>()
	const data = useData()
	const labels = useDataLabels()

	return (
		<div className="my-6">
			<ActionListItem Icon={BsTags} current={!currentLabel} text="All labels" href="/links" />

			{labels.map(label => (
				<ActionListItem
					key={label}
					Icon={BsTag}
					current={label === currentLabel}
					text={label}
					href={`/links/labels/${label}`}
				>
					<div className="text-xs text-neutral-500">
						{data?.filter(item => item.labels.includes(label)).length}
					</div>
				</ActionListItem>
			))}
		</div>
	)
}
