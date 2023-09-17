// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoButtonPrimary, OrdoButtonSecondary } from "$components/buttons/buttons"
import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { isNonEmptyString } from "@ordo-pink/tau"
import { ChangeEvent, useState } from "react"
import { BsPencil } from "react-icons/bs"

type Props = {
	data: PlainData
}

export default function RenameDirectoryModal({ data }: Props) {
	const { commands } = useSharedContext()
	const [name, setName] = useState(data.name)
	const [isValidPath, setIsValidPath] = useState(true)

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value)
		setIsValidPath(isNonEmptyString(event.target.value))
	}

	const renameDirectory = () => {
		commands.emit<cmd.data.rename>("data.rename", { fsid: data.fsid, name })
		commands.emit<cmd.modal.hide>("modal.hide")
	}

	const tPlaceholder = "E.g. 123/123"
	const tTitle = "Rename directory"
	const tCancel = "Cancel"
	const tCreate = "Rename"
	const tInvalidPath = "Invalid directory name"

	return (
		<div className="w-[30rem] max-w-full flex flex-col gap-8">
			<div className="flex space-x-2 px-8 pt-8 items-center">
				<div className="bg-gradient-to-tr from-slate-400 dark:from-slate-600 to-zinc-400 dark:to-zinc-600 rounded-full text-xl text-neutral-200 p-3 shadow-md">
					<BsPencil />
				</div>
				<div className="grow flex flex-col gap-y-4">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="pl-8">
						{/* <PathBreadcrumbs path={parentPath ?? "/"} /> */}
						<input
							className="w-full rounded-lg outline-none bg-neutral-200 dark:bg-neutral-600 px-4 py-2 shadow-inner"
							placeholder={tPlaceholder}
							type="text"
							autoComplete="off"
							aria-autocomplete="none"
							autoFocus
							value={name}
							onChange={handleInputChange}
						/>
						<div
							className={`mt-1 text-center text-rose-500 text-sm transition-opacity duration-100 ${
								isValidPath ? "opacity-0" : "opacity-100"
							}`}
						>
							{tInvalidPath}
						</div>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-end space-x-2 px-8 pb-4 pt-4 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-b-lg">
				<OrdoButtonSecondary
					onClick={() => commands.emit<cmd.modal.hide>("modal.hide")}
					hotkey="Esc"
				>
					{tCancel}
				</OrdoButtonSecondary>

				<OrdoButtonPrimary
					onClick={renameDirectory}
					hotkey="mod+enter"
					disabled={!name || !isValidPath}
				>
					{tCreate}
				</OrdoButtonPrimary>
			</div>
		</div>
	)
}
