// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Card from "$components/card.component"
import { CenteredPage } from "$components/centered-page"
import { TextInput } from "$components/input"
import { useAccelerator } from "$hooks/use-accelerator.hook"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { useRef, useState } from "react"
import GTDList from "./gtd-list.component"
import { useInbox } from "../hooks/use-inbox"

export default function GTDInbox() {
	const { commands } = useSharedContext()
	const items = useInbox()
	const [newItem, setNewItem] = useState("")
	const createInputRef = useRef<HTMLInputElement>(null)

	useAccelerator("meta+n", () => createInputRef.current?.focus())

	const tAddToInboxInputPlaceholder = "Что делается..."

	return (
		<CenteredPage centerX centerY>
			<div className="px-4 py-8 w-full flex flex-col space-y-4 items-center overflow-y-hidden">
				<div className="w-full max-w-2xl flex flex-col space-y-4">
					<Card className="h-[90vh]" title="Входящие">
						<TextInput
							forwardRef={createInputRef}
							id="add-to-inbox"
							label=""
							value={newItem}
							onInput={e => setNewItem(e.target.value)}
							onKeyDown={e => {
								if (e.key === "Enter" && newItem) {
									commands.emit<cmd.data.create>("data.create", {
										name: newItem,
										parent: null,
										labels: ["gtd"],
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
