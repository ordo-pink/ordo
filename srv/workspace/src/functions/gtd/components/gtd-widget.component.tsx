// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoButtonPrimary } from "$components/buttons/buttons"
import { TextInput } from "$components/input"
import { Loader } from "$components/loading/loader"
import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { isNonEmptyString } from "@ordo-pink/tau"
import { useState } from "react"
import { BsCheckCircle, BsInfoCircle, BsXCircle } from "react-icons/bs"
import { GTDCommands } from "../types"
import { useInbox } from "../hooks/use-inbox"

export default function GTDWidget() {
	const { commands } = useSharedContext()
	const inbox = useInbox()
	const [newItem, setNewItem] = useState("")

	return (
		<div className="w-full max-w-lg p-4 flex flex-col space-y-4 items-start">
			<div className="space-y-4 pb-4 flex flex-col items-center justify-center w-full text-neutral-500">
				<InboxStatus inboxChildren={inbox} />
			</div>

			<TextInput
				id="inbox"
				label="Add quick reminder"
				placeholder="Sell milk..."
				value={newItem}
				onInput={e => setNewItem(e.target.value)}
				onKeyDown={e => {
					if (e.key === "Enter" && isNonEmptyString(newItem)) {
						commands.emit<cmd.data.create>("data.create", {
							name: newItem,
							parent: null,
							labels: ["todo", "inbox"],
						})

						setNewItem("")

						commands.emit<cmd.notification.show>("notification.show", {
							message: newItem,
							type: "success",
							duration: 3,
							title: "New reminder created",
						})
					}
				}}
			/>

			<OrdoButtonPrimary
				hotkey="mod+i"
				onClick={() => commands.emit<GTDCommands.openInbox>("gtd.open-inbox")}
			>
				Go to Inbox
			</OrdoButtonPrimary>
		</div>
	)
}

type InboxStatusP = { inboxChildren: PlainData[] | null }
const InboxStatus = ({ inboxChildren }: InboxStatusP) =>
	Switch.of(inboxChildren)
		.case(null, () => <Loader />)
		.case(
			data => data!.length === 0,
			() => (
				<div className="flex items-center space-x-2">
					<BsCheckCircle className="text-xl text-emerald-500" />
					<div className="text-sm">Your inbox is very tidy! Did you forget something?</div>
				</div>
			),
		)
		.case(
			data => data!.length === 1,
			() => (
				<div className="flex items-center space-x-2">
					<BsInfoCircle className="text-xl text-yellow-500" />
					<div className="text-sm">
						{inboxChildren!.length} item in your inbox. Why wasn't it moved yet?
					</div>
				</div>
			),
		)
		.case(
			data => data!.length <= 10,
			() => (
				<div className="flex items-center space-x-2">
					<BsInfoCircle className="text-xl text-yellow-500" />
					<div className="text-sm">
						{inboxChildren!.length} items in your inbox. You've been busy!
					</div>
				</div>
			),
		)
		.default(() => (
			<div className="flex items-center space-x-2">
				<BsXCircle className="text-xl text-rose-500" />
				<div className="text-sm">
					{inboxChildren!.length} items in your inbox. This definitely needs a refinement!
				</div>
			</div>
		))