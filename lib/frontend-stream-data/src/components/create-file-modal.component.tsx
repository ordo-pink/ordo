// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { ChangeEvent, useState } from "react"
import { BsNodePlus } from "react-icons/bs"

import { type PlainData } from "@ordo-pink/data"
import { isNonEmptyString } from "@ordo-pink/tau"
import { useCommands } from "@ordo-pink/frontend-react-hooks"

import OrdoButton from "@ordo-pink/frontend-react-components/button"

type P = { parent: PlainData | null }
export default function CreateFileModal({ parent }: P) {
	const commands = useCommands()
	const [name, setName] = useState("")

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)

	const handleCreateFile = () => {
		commands.emit<cmd.data.create>("data.create", {
			name,
			parent: parent?.fsid ?? null,
		})
		commands.emit<cmd.modal.hide>("modal.hide")
	}

	const tPlaceholder = "Как назовём?"
	const tTitle = "Создать файл"
	const tCancel = "Отмена"
	const tCreate = "Создать"

	return (
		<div className="flex w-[30rem] max-w-full flex-col gap-8">
			<div className="flex items-center space-x-2 px-8 pt-8">
				<div className="rounded-full bg-gradient-to-tr from-slate-400 to-zinc-400 p-3 text-xl text-neutral-200 shadow-md dark:from-slate-600 dark:to-zinc-600">
					<BsNodePlus />
				</div>
				<div className="flex grow flex-col gap-y-4">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="pl-8">
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
					disabled={!isNonEmptyString(name)}
					onClick={handleCreateFile}
					hotkey="mod+enter"
				>
					{tCreate}
				</OrdoButton.Primary>
			</div>
		</div>
	)
}
