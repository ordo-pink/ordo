// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useRef, useState } from "react"

import { useAccelerator, useCommands } from "@ordo-pink/frontend-react-hooks"

import Card from "@ordo-pink/frontend-react-components/card"
import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"
import { TextInput } from "@ordo-pink/frontend-react-components/input"

import { useInbox } from "../hooks/use-inbox.hook"

import GTDList from "./list.component"

export default function GTDInbox() {
	const commands = useCommands()
	const items = useInbox()

	const [newItem, setNewItem] = useState("")
	const createInputRef = useRef<HTMLInputElement>(null)

	useAccelerator("meta+n", () => createInputRef.current?.focus())

	const tAddToInboxInputPlaceholder = "Что делается..."

	return (
		<CenteredPage centerX centerY>
			<div className="flex w-full flex-col items-center space-y-4 overflow-y-hidden px-4 py-8">
				<div className="flex w-full max-w-2xl flex-col space-y-4">
					<Card className="h-[90vh]" title="Входящие">
						<TextInput
							autoFocus
							forwardRef={createInputRef}
							id="add-to-inbox"
							label=""
							value={newItem}
							onInput={event => setNewItem(event.target.value)}
							onKeyDown={event => {
								if (event.key === "Enter" && newItem) {
									commands.emit<cmd.data.create>("data.create", {
										name: newItem,
										parent: null,
										labels: ["gtd", "inbox"],
									})

									setNewItem("")
								}
							}}
							placeholder={tAddToInboxInputPlaceholder}
						/>

						<GTDList items={items} />
					</Card>
				</div>
			</div>
		</CenteredPage>
	)
}
