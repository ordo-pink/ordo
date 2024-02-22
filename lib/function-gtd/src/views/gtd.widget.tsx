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

import { BsCheckCircle, BsInfoCircle, BsXCircle } from "react-icons/bs"
import { useState } from "react"

import { PlainData } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"
import { isNonEmptyString } from "@ordo-pink/tau"
import { useCommands } from "@ordo-pink/frontend-react-hooks"

import Link from "@ordo-pink/frontend-react-components/link"
import Loader from "@ordo-pink/frontend-react-components/loader"
import OrdoButton from "@ordo-pink/frontend-react-components/button"
import { TextInput } from "@ordo-pink/frontend-react-components/input"

import { useInbox } from "../hooks/use-inbox.hook"

export default function GTDWidget() {
	const commands = useCommands()
	const inbox = useInbox()
	const [newItem, setNewItem] = useState("")

	const handleCreate = () => {
		if (!newItem) return

		commands.emit<cmd.data.create>("data.create", {
			name: newItem,
			parent: null,
			labels: ["gtd", "inbox"],
		})

		setNewItem("")

		commands.emit<cmd.notification.show>("notification.show", {
			message: newItem,
			type: "success",
			duration: 5,
			title: "Задача добавлена во входящие",
		})
	}

	return (
		<div className="flex size-full max-w-lg flex-col items-center justify-center space-y-4 p-4">
			<div className="flex w-full flex-col items-center justify-center space-y-4 pb-4 text-neutral-500">
				<InboxStatus inboxChildren={inbox} />
			</div>

			<TextInput
				id="inbox"
				label="Добавить задачу"
				placeholder="Вот дела..."
				autoFocus
				value={newItem}
				onInput={e => setNewItem(e.target.value)}
				onKeyDown={e => {
					if (e.key === "Enter" && isNonEmptyString(newItem)) handleCreate()
				}}
			/>

			<OrdoButton.Primary onClick={handleCreate}>Создать</OrdoButton.Primary>
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
					<div className="text-sm">Во входящих пусто. Пора бездельничать!</div>
				</div>
			),
		)
		.case(
			data => data!.length === 1,
			() => (
				<div className="flex items-center space-x-2">
					<BsInfoCircle className="text-xl text-yellow-500" />
					<div className="text-sm">
						Задач во{" "}
						<Link href="/gtd" className="text-sm">
							входящих
						</Link>
						: {inboxChildren!.length}. А почему не 0?
					</div>
				</div>
			),
		)
		.case(
			data => data!.length <= 20,
			() => (
				<div className="flex items-center space-x-2">
					<BsInfoCircle className="text-xl text-orange-500" />
					<div className="text-sm">
						Задач во{" "}
						<Link href="/gtd" className="text-sm">
							входящих
						</Link>
						: {inboxChildren!.length}.
					</div>
				</div>
			),
		)
		.default(() => (
			<div className="flex items-center space-x-2">
				<BsXCircle className="text-xl text-rose-500" />
				<div className="text-sm">
					Задач во{" "}
					<Link href="/gtd" className="text-sm">
						входящих
					</Link>
					: {inboxChildren!.length}. F.
				</div>
			</div>
		))
