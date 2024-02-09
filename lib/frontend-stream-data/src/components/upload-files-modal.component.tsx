// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { type ChangeEvent, useState } from "react"
import { BsFileEarmarkPlus } from "react-icons/bs"

import { type PlainData } from "@ordo-pink/data"
import { useCommands } from "@ordo-pink/frontend-react-hooks"

import OrdoButton from "@ordo-pink/frontend-react-components/button"

type Props = {
	parent: PlainData | null
}

export default function UploadFilesModal({ parent }: Props) {
	const commands = useCommands()

	const [files, setFiles] = useState<File[]>([])

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.target.files && setFiles(Array.from(e.target.files))
	}

	const handleOkButtonClick = async () => {
		for (const file of files) {
			const name = file.name

			commands.emit<cmd.data.uploadContent>("data.upload-content", {
				name,
				parent: parent?.fsid ?? null,
				content: await file.arrayBuffer(),
			})
		}
	}

	const tPlaceholder = "Выбрать"
	const tTitle = "Загрузить файлы"
	const tCancel = "Отмена"
	const tUpload = "Загрузить"

	return (
		<div className="flex w-[30rem] max-w-full flex-col gap-8">
			<div className="flex items-center space-x-2 px-8 pt-8">
				<div className="rounded-full bg-gradient-to-tr from-slate-400 to-zinc-400 p-3 text-xl text-neutral-200 shadow-md dark:from-slate-600 dark:to-zinc-600">
					<BsFileEarmarkPlus />
				</div>
				<div className="flex grow flex-col gap-y-4">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="pl-8">
						{/* <PathBreadcrumbs path={parent?.path ?? "/"} /> */}
						<input
							type="file"
							multiple
							className="w-full rounded-lg border border-neutral-400 bg-white px-4 py-2 outline-none dark:border-0 dark:bg-neutral-600"
							placeholder={tPlaceholder}
							onChange={handleFileChange}
						/>

						<ul>
							{Array.from(files).map((file, i) => (
								<li key={i}>
									{file.name} - {file.type}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-end space-x-2 rounded-b-lg bg-neutral-200/50 px-8 py-4 dark:bg-neutral-800/30">
				<OrdoButton.Secondary
					hotkey="escape"
					onClick={() => commands.emit<cmd.modal.hide>("modal.hide")}
				>
					{tCancel}
				</OrdoButton.Secondary>

				<OrdoButton.Primary
					hotkey="mod+enter"
					disabled={!files}
					onClick={() => void handleOkButtonClick()}
				>
					{tUpload}
				</OrdoButton.Primary>
			</div>
		</div>
	)
}
