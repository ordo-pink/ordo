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
					href={`/links/labels/${encodeURIComponent(label)}`}
				>
					<div className="text-xs text-neutral-500">
						{data?.filter(item => item.labels.includes(label)).length}
					</div>
				</ActionListItem>
			))}
		</div>
	)
}
