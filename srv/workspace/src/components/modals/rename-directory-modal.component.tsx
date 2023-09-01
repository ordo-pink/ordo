// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoButtonPrimary, OrdoButtonSecondary } from "$components/buttons/buttons"
import { PathBreadcrumbs } from "$components/path-breadcrumbs/path-breadcrumbs"
import { Directory, DirectoryPath, DirectoryUtils } from "@ordo-pink/datautil"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { ChangeEvent, useState } from "react"
import { BsPencil } from "react-icons/bs"

type Props = {
	directory: Directory
}

export default function RenameDirectoryModal({ directory }: Props) {
	const { commands } = useSharedContext()
	const [directoryName, setDirectoryName] = useState(
		DirectoryUtils.getReadableName(directory.path) ?? "",
	)
	const [isValidPath, setIsValidPath] = useState(true)
	const [parentPath, setParentPath] = useState(DirectoryUtils.getParentPath(directory.path) ?? "/")

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setDirectoryName(event.target.value)
		setIsValidPath(
			event.target.value
				? DirectoryUtils.isValidPath(parentPath.concat(event.target.value).concat("/"))
				: true,
		)
		setParentPath(
			DirectoryUtils.isValidPath(parentPath.concat(event.target.value))
				? DirectoryUtils.getParentPath(parentPath.concat(event.target.value) as DirectoryPath) ??
						"/"
				: parentPath,
		)
	}

	const renameDirectory = () => {
		const newPath = `${parentPath}${directoryName}/` as const
		commands.emit<cmd.data.directory.update>("data.update-directory", {
			path: directory.path,
			update: { path: newPath },
		})

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
						<PathBreadcrumbs path={parentPath ?? "/"} />
						<input
							className="w-full rounded-lg outline-none bg-neutral-200 dark:bg-neutral-600 px-4 py-2 shadow-inner"
							placeholder={tPlaceholder}
							type="text"
							autoComplete="off"
							aria-autocomplete="none"
							autoFocus
							value={directoryName}
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
					disabled={!directoryName || !isValidPath}
				>
					{tCreate}
				</OrdoButtonPrimary>
			</div>
		</div>
	)
}
