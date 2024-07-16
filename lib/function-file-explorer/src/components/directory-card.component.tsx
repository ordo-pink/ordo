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

import { BsFolder2, BsLink45Deg, BsTags } from "react-icons/bs"
import { MouseEvent } from "react"

import DataLabel from "@ordo-pink/frontend-react-components/data-label"
import { LIB_DIRECTORY_FSID } from "@ordo-pink/core"
import { PlainData } from "@ordo-pink/data"
import { useCommands } from "@ordo-pink/frontend-react-hooks"

type P = { plain: PlainData }
export default function DirectoryCardComponent({ plain }: P) {
	const commands = useCommands()

	const showContextMenu = (event: MouseEvent<HTMLDivElement>) => {
		if (plain.fsid === LIB_DIRECTORY_FSID) {
			event.stopPropagation()
			event.preventDefault()
			return
		}
		commands.emit<cmd.ctx_menu.show>("context-menu.show", { event, payload: plain })
	}

	return (
		<div
			className="directory-card flex flex-col items-center space-y-1"
			onContextMenu={showContextMenu}
		>
			<BsFolder2 className="size-full" />
			<div className="mt-1 line-clamp-2 break-words text-center text-sm">{plain.name}</div>
			<div className="flex space-x-1">
				<DataLabel>
					<div
						className="flex items-center space-x-1 text-xs"
						title={`Метки:\n\n- ${plain.labels.join("\n- ")}`}
						onClick={() =>
							commands.emit<cmd.data.show_edit_labels_palette>(
								"data.show-edit-labels-palette",
								plain,
							)
						}
					>
						<BsTags />
						<p>{plain.labels.length}</p>
					</div>
				</DataLabel>

				<DataLabel>
					<div
						className="flex items-center space-x-1 text-xs"
						title={`Ссылки на файлы:\n\n- ${plain.links.join("\n- ")}`}
						onClick={() =>
							commands.emit<cmd.data.show_edit_links_palette>("data.show-edit-links-palette", plain)
						}
					>
						<BsLink45Deg />
						<p>{plain.links.length}</p>
					</div>
				</DataLabel>
			</div>
		</div>
	)
}
