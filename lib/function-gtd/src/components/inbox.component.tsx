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

import { useEffect, useRef, useState } from "react"

import { useAccelerator, useCommands, useIsMobile } from "@ordo-pink/frontend-react-hooks"

import Card from "@ordo-pink/frontend-react-components/card"
import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"
import { TextInput } from "@ordo-pink/frontend-react-components/input"

import { useInbox } from "../hooks/use-inbox.hook"

import GTDList from "./list.component"

export default function GTDInbox() {
	const commands = useCommands()
	const items = useInbox()
	const isMobile = useIsMobile()

	const [newItem, setNewItem] = useState("")
	const createInputRef = useRef<HTMLInputElement>(null)

	useAccelerator("meta+n", () => createInputRef.current?.focus())

	useEffect(() => {
		commands.emit<cmd.application.set_title>("application.set-title", "Входящие | GTD")
	}, [commands])

	const tAddToInboxInputPlaceholder = "Что делается..."

	return (
		<CenteredPage centerX centerY>
			<div className="flex w-full flex-col items-center space-y-4 overflow-y-hidden px-4 py-8">
				<div className="flex w-full max-w-2xl flex-col space-y-4">
					<Card className="h-[90vh]" title="Входящие">
						<TextInput
							autoFocus={!isMobile}
							forwardRef={createInputRef}
							id="add-to-inbox"
							label=""
							value={newItem}
							onInput={event => setNewItem(event.target.value)}
							onKeyDown={event => {
								if (event.key === "Enter" && newItem) {
									commands.emit<cmd.data.create>("data.metadata.create", {
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
