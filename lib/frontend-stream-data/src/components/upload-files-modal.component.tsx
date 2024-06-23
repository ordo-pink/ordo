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
		<div className="flex w-full flex-col gap-8">
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
