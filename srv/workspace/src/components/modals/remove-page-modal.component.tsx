// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoButtonSecondary, OrdoButtonPrimary } from "$components/buttons/buttons"
import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { BsNodeMinus } from "react-icons/bs"

type Props = {
	data: PlainData
}

export default function RemoveFileModal({ data }: Props) {
	const { commands } = useSharedContext()

	const handleRemoveFile = () => {
		commands.emit<cmd.data.remove>("data.remove", { fsid: data.fsid })
		commands.emit<cmd.modal.hide>("modal.hide")
	}

	const tTitle = "Remove page"
	const tText = `Are you sure you want to remove "${data.name}"? This action is irreversible.`
	const tCancel = "Cancel"
	const tRemove = "Remove"

	return (
		<div className="w-[30rem] max-w-full flex flex-col gap-8">
			<div className="flex space-x-2 px-8 pt-8 items-center">
				<div className="bg-gradient-to-tr from-red-400 dark:from-red-600 to-rose-400 dark:to-rose-600 rounded-full text-xl text-neutral-200 p-3 shadow-md">
					<BsNodeMinus />
				</div>
				<div className="grow flex flex-col gap-y-4">
					<h3 className="px-8 text-lg font-bold">{tTitle}</h3>

					<div className="pl-8">{tText}</div>
				</div>
			</div>
			<div className="flex items-center justify-end space-x-2 px-8 pb-4 pt-4 bg-neutral-200/50 dark:bg-neutral-800/30 rounded-b-lg">
				<OrdoButtonSecondary
					onClick={() => commands.emit<cmd.modal.hide>("modal.hide")}
					hotkey="Esc"
				>
					{tCancel}
				</OrdoButtonSecondary>

				<OrdoButtonPrimary onClick={handleRemoveFile} hotkey="mod+enter">
					{tRemove}
				</OrdoButtonPrimary>
			</div>
		</div>
	)
}
