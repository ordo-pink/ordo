// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useRef, useState } from "react"

import {
	useAccelerator,
	useChildren,
	useCommands,
	useDataByFSID,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { FSID } from "@ordo-pink/data"

import Card from "@ordo-pink/frontend-react-components/card"
import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"
import Loading from "@ordo-pink/frontend-react-components/loading-page"
import { TextInput } from "@ordo-pink/frontend-react-components/input"

import GTDList from "./list.component"

type P = { fsid: FSID }
export default function GTDSubtasks({ fsid }: P) {
	const commands = useCommands()
	const data = useDataByFSID(fsid)
	const children = useChildren(data)
	const [newItem, setNewItem] = useState("")
	const createInputRef = useRef<HTMLInputElement>(null)

	useAccelerator("meta+n", () => createInputRef.current?.focus())

	useEffect(() => {
		data &&
			commands.emit<cmd.application.setTitle>("application.set-title", `Проет ${data.name} | GTD`)
	}, [data, commands])

	const tAddToInboxInputPlaceholder = "Что делается..."

	return Either.fromNullable(data).fold(Loading, data => (
		<CenteredPage centerX centerY>
			<div className="flex overflow-y-hidden flex-col items-center px-4 py-8 space-y-4 w-full">
				<div className="flex flex-col space-y-4 w-full max-w-2xl">
					<Card className="h-[90vh]" title={data.name}>
						<TextInput
							autoFocus
							forwardRef={createInputRef}
							id="add-to-inbox"
							label=""
							value={newItem}
							onInput={e => setNewItem(e.target.value)}
							onKeyDown={e => {
								if (e.key !== "Enter" || !newItem) return

								commands.emit<cmd.data.create>("data.create", { name: newItem, parent: fsid })
								setNewItem("")
							}}
							placeholder={tAddToInboxInputPlaceholder}
						/>

						<GTDList items={children} />
					</Card>
				</div>
			</div>
		</CenteredPage>
	))
}
