// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsNodeMinus } from "react-icons/bs"

import { type PlainData } from "@ordo-pink/data"
import { useCommands } from "@ordo-pink/frontend-react-hooks"

import OrdoButton from "@ordo-pink/frontend-react-components/button"

type P = { data: PlainData }
export default function RemoveFileModal({ data }: P) {
	const commands = useCommands()

	const handleRemoveFile = () => {
		commands.emit<cmd.data.remove>("data.remove", data)
		commands.emit<cmd.modal.hide>("modal.hide")
	}

	const tTitle = "Удалить файл"
	const tText = `Точно удалить "${data.name}"? Обратной дороги не будет.`
	const tCancel = "Отмена"
	const tRemove = "Удалить"

	return (
		<div className="flex w-[30rem] max-w-full flex-col gap-8">
			<div className="flex items-center space-x-2 px-8 pt-8">
				<div className="rounded-full bg-gradient-to-tr from-red-400 to-rose-400 p-3 text-xl text-neutral-200 shadow-md dark:from-red-600 dark:to-rose-600">
					<BsNodeMinus />
				</div>
				<div className="flex grow flex-col gap-y-4">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="pl-8">{tText}</div>
				</div>
			</div>
			<div className="flex items-center justify-end space-x-2 rounded-b-lg bg-neutral-200/50 px-8 py-4 dark:bg-neutral-800/30">
				<OrdoButton.Secondary
					onClick={() => commands.emit<cmd.modal.hide>("modal.hide")}
					hotkey="Esc"
				>
					{tCancel}
				</OrdoButton.Secondary>

				<OrdoButton.Primary onClick={handleRemoveFile} hotkey="mod+enter">
					{tRemove}
				</OrdoButton.Primary>
			</div>
		</div>
	)
}
