// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoButtonSecondary, OrdoButtonPrimary } from "$components/buttons/buttons"
// import { PathBreadcrumbs } from "$components/path-breadcrumbs/path-breadcrumbs"
import { PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { Nullable, isNonEmptyString } from "@ordo-pink/tau"

import { ChangeEvent, useState } from "react"
import { BsNodePlus } from "react-icons/bs"

type Props = {
	parent: Nullable<PlainData>
}

export default function CreatePageModal({ parent }: Props) {
	const { commands } = useSharedContext()
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
		<div className="w-[30rem] max-w-full flex flex-col gap-8">
			<div className="flex space-x-2 px-8 pt-8 items-center">
				<div className="bg-gradient-to-tr from-slate-400 dark:from-slate-600 to-zinc-400 dark:to-zinc-600 rounded-full text-xl text-neutral-200 p-3 shadow-md">
					<BsNodePlus />
				</div>
				<div className="grow flex flex-col gap-y-4">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="pl-8">
						{/* <PathBreadcrumbs path={parent?.path ?? "/"} /> */}
						<input
							className="w-full rounded-lg bg-neutral-200 dark:bg-neutral-600 px-4 py-2 shadow-inner outline-none"
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
			<div className="flex items-center justify-end space-x-2 px-8 pb-4 pt-4 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-b-lg">
				<OrdoButtonSecondary
					onClick={() => commands.emit<cmd.modal.hide>("modal.hide")}
					hotkey="Esc"
				>
					{tCancel}
				</OrdoButtonSecondary>

				<OrdoButtonPrimary
					disabled={!isNonEmptyString(name)}
					onClick={handleCreateFile}
					hotkey="mod+enter"
				>
					{tCreate}
				</OrdoButtonPrimary>
			</div>
		</div>
	)
}
