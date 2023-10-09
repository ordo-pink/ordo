// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import {
	OrdoButtonNeutral,
	OrdoButtonPrimary,
	OrdoButtonSecondary,
} from "$components/buttons/buttons"
import { TextInput } from "$components/input"
import Link from "$components/link"
import { Loader } from "$components/loading/loader"
import { PlainData } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { isNonEmptyString, noop } from "@ordo-pink/tau"
import { FC, useEffect, useState } from "react"
import { BsCheckCircle, BsInfoCircle, BsXCircle } from "react-icons/bs"
import { GTDCommands } from "../types"

export default function GTDWidget() {
	const { commands, data } = useSharedContext()
	const [inboxChildren, setInboxChildren] = useState<PlainData[] | null>(null)
	const [newItem, setNewItem] = useState("")

	useEffect(() => {
		Either.fromNullable(data)
			.chain(data =>
				Either.fromNullable(data.find(item => item.name === ".gtd" && item.parent === null)).chain(
					gtd =>
						Either.fromNullable(
							data.find(item => item.name === ".inbox" && item.parent === gtd.fsid),
						),
				),
			)
			.map(
				inbox =>
					inbox.children.map(child => data!.find(item => item.fsid === child)) as PlainData[],
			)
			.fold(noop, setInboxChildren)
	}, [data])

	return (
		<div className="w-full max-w-lg p-4 flex flex-col space-y-4 items-start">
			<div className="space-y-4 pb-4 flex flex-col items-center justify-center w-full text-neutral-500">
				<InboxStatus inboxChildren={inboxChildren} />
			</div>

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
						commands.emit<cmd.notification.show>("notification.show", {
							message: newItem,
							type: "success",
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
