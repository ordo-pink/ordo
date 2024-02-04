// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoButtonSecondary, OrdoButtonPrimary } from "$components/buttons/buttons"
// import { PathBreadcrumbs } from "$components/path-breadcrumbs/path-breadcrumbs"
import { PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/core"
import { isNonEmptyString } from "@ordo-pink/tau"

import { ChangeEvent, useState } from "react"
import { BsNodePlus } from "react-icons/bs"

type Props = {
	parent: PlainData | null
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
			<div className="flex items-center px-8 pt-8 space-x-2">
				<div className="p-3 text-xl bg-gradient-to-tr rounded-full shadow-md from-slate-400 dark:from-slate-600 to-zinc-400 dark:to-zinc-600 text-neutral-200">
					<BsNodePlus />
				</div>
				<div className="flex flex-col gap-y-4 grow">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="pl-8">
						{/* <PathBreadcrumbs path={parent?.path ?? "/"} /> */}
						<input
							className="px-4 py-2 w-full rounded-lg shadow-inner outline-none bg-neutral-200 dark:bg-neutral-600"
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
			<div className="flex justify-end items-center px-8 pt-4 pb-4 space-x-2 rounded-b-lg bg-neutral-200/50 dark:bg-neutral-800/30">
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
