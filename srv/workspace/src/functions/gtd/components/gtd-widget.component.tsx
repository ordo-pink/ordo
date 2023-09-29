// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { TextInput } from "$components/input"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { isNonEmptyString } from "@ordo-pink/tau"
import { useState } from "react"

export default function GTDWidget() {
	const { commands, data } = useSharedContext()

	const [newItem, setNewItem] = useState("")

	return (
		<div className="w-full max-w-lg p-4">
			<TextInput
				id="inbox"
				label="Add quick reminder"
				placeholder="Sell milk..."
				value={newItem}
				onInput={e => setNewItem(e.target.value)}
				onKeyDown={e => {
					if (e.key === "Enter" && isNonEmptyString(newItem)) {
						const gtdDirectory = data?.find(item => item.name === ".gtd" && item.parent === null)
						const inboxDirectory = data?.find(
							item => item.name === ".inbox" && item.parent === gtdDirectory?.fsid,
						)

						inboxDirectory &&
							commands.emit<cmd.data.create>("data.create", {
								name: newItem,
								parent: inboxDirectory.fsid,
							})

						setNewItem("")
					}
				}}
			/>
		</div>
	)
}
