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

import { ChangeEvent, useState } from "react"
import { BsNodePlus } from "react-icons/bs"

import { useCommands, useStrictSubscription } from "@ordo-pink/frontend-react-hooks"
import { type PlainData } from "@ordo-pink/data"
import { is_non_empty_string } from "@ordo-pink/tau"

import OrdoButton from "@ordo-pink/frontend-react-components/button"
import { fileAssociations$ } from "@ordo-pink/frontend-stream-file-associations"

type P = { parent: PlainData | null }
export default function CreateFileModal({ parent }: P) {
	const commands = useCommands()
	const [name, setName] = useState("")
	const [contentType, setContentType] = useState("text/ordo")

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)
	const fileAssociations = useStrictSubscription(fileAssociations$, [])

	const handleCreateFile = () => {
		commands.emit<cmd.data.create>("data.metadata.create", {
			name,
			parent: parent?.fsid ?? null,
			contentType,
		})
		commands.emit<cmd.modal.hide>("modal.hide")
	}

	const tPlaceholder = "Как назовём?"
	const tTitle = "Создать файл"
	const tCancel = "Отмена"
	const tCreate = "Создать"

	return (
		<div className="flex w-full flex-col gap-8">
			<div className="flex items-center space-x-2 px-8 pt-8">
				<div className="rounded-full bg-gradient-to-tr from-slate-400 to-zinc-400 p-3 text-xl text-neutral-200 shadow-md dark:from-slate-600 dark:to-zinc-600">
					<BsNodePlus />
				</div>
				<div className="flex grow flex-col gap-y-4">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="flex flex-col gap-y-2 pl-8">
						{/* <PathBreadcrumbs path={parent?.path ?? "/"} /> */}
						<input
							className="w-full rounded-lg bg-neutral-200 px-4 py-2 shadow-inner outline-none dark:bg-neutral-600"
							placeholder={tPlaceholder}
							type="text"
							autoComplete="off"
							aria-autocomplete="none"
							autoFocus
							value={name}
							onChange={handleInputChange}
						/>

						<select
							className="w-full rounded-lg bg-neutral-200 px-4 py-2 shadow-inner outline-none dark:bg-neutral-600"
							onChange={e => {
								setContentType(e.target.value)
							}}
						>
							{fileAssociations.map(fileAssociation => (
								<option key={fileAssociation.name} value={fileAssociation.content_type}>
									{fileAssociation.content_type}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-end space-x-2 rounded-b-lg bg-neutral-200/50 px-8 py-4 dark:bg-neutral-800/30">
				<OrdoButton.Secondary
					onClick={() => commands.emit<cmd.modal.hide>("modal.hide")}
					hotkey="Esc"
				>
					{tCancel}
				</OrdoButton.Secondary>

				<OrdoButton.Primary
					disabled={!is_non_empty_string(name)}
					onClick={handleCreateFile}
					hotkey="mod+enter"
				>
					{tCreate}
				</OrdoButton.Primary>
			</div>
		</div>
	)
}
