// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Card from "$components/card.component"
import { CenteredPage } from "$components/centered-page"
import { TextInput } from "$components/input"
import { useAccelerator } from "$hooks/use-accelerator.hook"
import { useSharedContext } from "@ordo-pink/core"
import { useRef, useState } from "react"
import GTDList from "./gtd-list.component"
import { useDataByLabel } from "$hooks/use-data.hook"

type P = { label: string }
export default function GTDLabel({ label }: P) {
	const { commands } = useSharedContext()
	const items = useDataByLabel([label])
	const [newItem, setNewItem] = useState("")
	const createInputRef = useRef<HTMLInputElement>(null)

	useAccelerator("meta+n", () => createInputRef.current?.focus())

	const tAddToInboxInputPlaceholder = "Вот бы сейчас..."

	return (
		<CenteredPage centerX centerY>
			<div className="flex overflow-y-hidden flex-col items-center px-4 py-8 space-y-4 w-full">
				<div className="flex flex-col space-y-4 w-full max-w-2xl">
					<Card className="h-[90vh]" title={`Метка #${label}`}>
						<TextInput
							forwardRef={createInputRef}
							id="add-to-label"
							label=""
							value={newItem}
							onInput={e => setNewItem(e.target.value)}
							onKeyDown={e => {
								if (e.key === "Enter" && newItem) {
									commands.emit<cmd.data.create>("data.create", {
										name: newItem,
										parent: null,
										labels: ["gtd", label],
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
