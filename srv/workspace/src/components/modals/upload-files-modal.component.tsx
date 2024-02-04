// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoButtonPrimary, OrdoButtonSecondary } from "$components/buttons/buttons"
import { PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/core"
import { ChangeEvent, useState } from "react"
import { BsFileEarmarkPlus } from "react-icons/bs"

type Props = {
	parent: PlainData | null
}

export default function UploadFilesModal({ parent }: Props) {
	const { commands } = useSharedContext()

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
		<div className="w-[30rem] max-w-full flex flex-col gap-8">
			<div className="flex items-center px-8 pt-8 space-x-2">
				<div className="p-3 text-xl bg-gradient-to-tr rounded-full shadow-md from-slate-400 dark:from-slate-600 to-zinc-400 dark:to-zinc-600 text-neutral-200">
					<BsFileEarmarkPlus />
				</div>
				<div className="flex flex-col gap-y-4 grow">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="pl-8">
						{/* <PathBreadcrumbs path={parent?.path ?? "/"} /> */}
						<input
							type="file"
							multiple
							className="px-4 py-2 w-full bg-white rounded-lg border outline-none dark:border-0 border-neutral-400 dark:bg-neutral-600"
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
			<div className="flex justify-end items-center px-8 pt-4 pb-4 space-x-2 rounded-b-lg bg-neutral-200/50 dark:bg-neutral-800/30">
				<OrdoButtonSecondary
					hotkey="escape"
					onClick={() => commands.emit<cmd.modal.hide>("modal.hide")}
				>
					{tCancel}
				</OrdoButtonSecondary>

				<OrdoButtonPrimary hotkey="mod+enter" disabled={!files} onClick={handleOkButtonClick}>
					{tUpload}
				</OrdoButtonPrimary>
			</div>
		</div>
	)
}
