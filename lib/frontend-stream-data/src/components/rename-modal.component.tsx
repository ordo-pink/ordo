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

import { type ChangeEvent, useState } from "react"
import { BsPencil } from "react-icons/bs"

import { type PlainData } from "@ordo-pink/data"
import { isNonEmptyString } from "@ordo-pink/tau"
import { useCommands } from "@ordo-pink/frontend-react-hooks"

import OrdoButton from "@ordo-pink/frontend-react-components/button"

type Props = {
	data: PlainData
}

export default function RenameModal({ data }: Props) {
	const commands = useCommands()
	const [name, setName] = useState(data.name)
	const [isValidPath, setIsValidPath] = useState(true)

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value)
		setIsValidPath(isNonEmptyString(event.target.value))
	}

	const rename = () => {
		commands.emit<cmd.data.rename>("data.rename", { fsid: data.fsid, name })
		commands.emit<cmd.modal.hide>("modal.hide")
	}

	const tPlaceholder = "Как теперь назовём?"
	const tTitle = "Переименовать файл"
	const tCancel = "Отмена"
	const tRename = "Переименовать"
	const tInvalidPath = "Неверное имя файла"

	return (
		<div className="flex w-[30rem] max-w-full flex-col gap-8">
			<div className="flex items-center space-x-2 px-8 pt-8">
				<div className="rounded-full bg-gradient-to-tr from-slate-400 to-zinc-400 p-3 text-xl text-neutral-200 shadow-md dark:from-slate-600 dark:to-zinc-600">
					<BsPencil />
				</div>
				<div className="flex grow flex-col gap-y-4">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="pl-8">
						{/* <PathBreadcrumbs path={parentPath ?? "/"} /> */}
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
						<div
							className={`mt-1 text-center text-sm text-rose-500 transition-opacity duration-100 ${
								isValidPath ? "opacity-0" : "opacity-100"
							}`}
						>
							{tInvalidPath}
						</div>
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

				<OrdoButton.Primary onClick={rename} hotkey="mod+enter" disabled={!name || !isValidPath}>
					{tRename}
				</OrdoButton.Primary>
			</div>
		</div>
	)
}
