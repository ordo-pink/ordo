// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoButtonPrimary, OrdoButtonSecondary } from "$components/buttons/buttons"
import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { Nullable } from "@ordo-pink/tau"
import { ChangeEvent, useState } from "react"
import { BsFileEarmarkPlus } from "react-icons/bs"

type Props = {
	parent: Nullable<PlainData>
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

	const tPlaceholder = "Choose files"
	const tTitle = "Upload files"
	const tCancel = "Cancel"
	const tUpload = "Upload"

	return (
		<div className="w-[30rem] max-w-full flex flex-col gap-8">
			<div className="flex space-x-2 px-8 pt-8 items-center">
				<div className="bg-gradient-to-tr from-slate-400 dark:from-slate-600 to-zinc-400 dark:to-zinc-600 rounded-full text-xl text-neutral-200 p-3 shadow-md">
					<BsFileEarmarkPlus />
				</div>
				<div className="grow flex flex-col gap-y-4">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="pl-8">
						{/* <PathBreadcrumbs path={parent?.path ?? "/"} /> */}
						<input
							type="file"
							multiple
							className="w-full outline-none border dark:border-0 border-neutral-400 rounded-lg bg-white dark:bg-neutral-600 px-4 py-2"
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
			<div className="flex items-center justify-end space-x-2 px-8 pb-4 pt-4 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-b-lg">
				<OrdoButtonSecondary
					hotkey="escape"
					onClick={() => commands.emit<cmd.modal.hide>("modal.hide")}
				>
					{tCancel}
				</OrdoButtonSecondary>

				<OrdoButtonPrimary hotkey="enter" disabled={!files} onClick={handleOkButtonClick}>
					{tUpload}
				</OrdoButtonPrimary>
			</div>
		</div>
	)
}
