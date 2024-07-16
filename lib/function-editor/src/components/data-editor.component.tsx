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

import { PiGraph, PiTreeStructure } from "react-icons/pi"

import { useCommands, useSelectDataList } from "@ordo-pink/frontend-react-hooks"
import { PlainData } from "@ordo-pink/data"
import { fromBooleanE } from "@ordo-pink/either"

import DataLabel from "@ordo-pink/frontend-react-components/data-label"

type P = { data: PlainData }
export default function DataEditor({ data }: P) {
	const commands = useCommands()
	const incomingLinks = useSelectDataList(item => item.links.includes(data.fsid))

	const handleLabelsClick = () =>
		commands.emit<cmd.data.show_edit_labels_palette>("data.show-edit-labels-palette", data)

	const handleLinksClick = () =>
		commands.emit<cmd.data.show_edit_links_palette>("data.show-edit-links-palette", data)

	return (
		<div className="flex flex-col gap-2 py-2">
			<div className="flex items-center space-x-4">
				<div
					className="flex items-center space-x-2 text-sm text-neutral-500"
					title="Входящие ссылки"
				>
					<PiGraph />
					<div>{incomingLinks.length}</div>
				</div>

				<div
					className="flex cursor-pointer items-center space-x-2 text-sm text-neutral-500"
					title="Исходящие ссылки"
					onClick={handleLinksClick}
				>
					<PiTreeStructure />
					<div>{data.links.length}</div>
				</div>
			</div>

			<div className="flex cursor-pointer flex-wrap items-center gap-1" onClick={handleLabelsClick}>
				{fromBooleanE(data.labels.length > 0).fold(
					() => (
						<div className="text-sm italic text-neutral-500">Добавить метки...</div>
					),
					() => data.labels.map(label => <DataLabel key={label}>{label}</DataLabel>),
				)}
			</div>
		</div>
	)
}
