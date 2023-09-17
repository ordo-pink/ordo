// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Card from "$components/card.component"
import { CenteredPage } from "$components/centered-page"
import { TextInput } from "$components/input"
import { useAccelerator } from "$hooks/use-accelerator"
import { PlainData } from "@ordo-pink/data"
import { CommandPalette, cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { Nullable } from "@ordo-pink/tau"
import { useEffect, useRef, useState } from "react"
import {
	BsArrowRightSquare,
	BsFileEarmarkPlus,
	BsNodePlus,
	BsPencilSquare,
	BsTags,
	BsTagsFill,
} from "react-icons/bs"
import GTDList from "./gtd-list.component"
import FileIconComponent from "../../file-explorer/components/file-icon.component"

export default function GTD() {
	const { commands, currentRoute, metadata } = useSharedContext()
	const [currentItem, setCurrentItem] = useState<Nullable<PlainData>>(null)
	const [children, setChildren] = useState<PlainData[]>([])
	const [newItem, setNewItem] = useState("")
	const gtdDirectory = metadata?.find(item => item.name === ".gtd" && item.parent === null)
	const createInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		commands.emit<cmd.commandPalette.add>("command-palette.add", {
			id: "add-gtd-task-to-current-list",
			onSelect: () => {
				createInputRef.current?.focus()
				commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			},
			readableName: "Add GTD task to current project",
			accelerator: "meta+n",
			Icon: BsFileEarmarkPlus,
		})

		return () => {
			commands.emit<cmd.commandPalette.remove>(
				"command-palette.remove",
				"add-gtd-task-to-current-list",
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useAccelerator("meta+n", () => createInputRef.current?.focus())

	useEffect(() => {
		commands.emit<cmd.contextMenu.add>("context-menu.add", {
			commandName: "data.show-rename-modal",
			Icon: BsPencilSquare,
			readableName: "Rename",
			shouldShow: ({ payload }) =>
				payload && payload.fsid && payload.name && payload.name !== ".inbox",
			type: "update",
		})

		commands.emit<cmd.contextMenu.add>("context-menu.add", {
			commandName: "data.show-add-label-palette",
			Icon: BsTags,
			readableName: "Add label",
			shouldShow: ({ payload }) => payload && payload.fsid && payload.name,
			type: "update",
		})

		commands.emit<cmd.contextMenu.add>("context-menu.add", {
			commandName: "data.show-remove-label-palette",
			Icon: BsTagsFill,
			readableName: "Remove label",
			shouldShow: ({ payload }) => payload && payload.fsid && payload.name,
			type: "update",
			shouldBeDisabled: ({ payload }) => payload.labels.length === 0,
		})

		commands.emit<cmd.contextMenu.add>("context-menu.add", {
			commandName: "data.show-create-modal",
			Icon: BsNodePlus,
			readableName: "Add",
			shouldShow: ({ payload }) => payload && payload.fsid,
			type: "create",
		})

		commands.emit<cmd.contextMenu.add>("context-menu.add", {
			commandName: "command-palette.show",
			Icon: BsArrowRightSquare,
			readableName: "Move...",
			shouldShow: ({ payload }) =>
				payload && payload.fsid && payload.name && payload.name !== ".inbox",
			payloadCreator: () => ({
				items: metadata?.map(
					item =>
						({
							id: item.name,
							readableName: item.name,
							onSelect: () => alert("TODO"),
							Icon: () => <FileIconComponent plain={item} />,
						}) satisfies CommandPalette.Item,
				),
			}),
			type: "update",
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!metadata || !currentRoute) return

		const gtd = metadata.find(item => item.name === ".gtd" && item.parent === null)

		const currentItem = metadata.find(item =>
			currentRoute.path === "/gtd"
				? item.name === ".inbox" && item.parent === gtd?.fsid
				: item.name === decodeURIComponent(currentRoute.params.project) &&
				  item.parent === gtd?.fsid,
		)

		setCurrentItem(currentItem ?? null)

		if (currentItem) {
			setChildren(
				currentItem.children
					.map(child => metadata.find(item => item.fsid === child))
					.filter(Boolean) as PlainData[],
			)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentRoute, gtdDirectory, metadata])

	const tAddToInboxInputPlaceholder = "Sell milk..."

	return (
		<CenteredPage centerX centerY>
			<div className="px-4 py-8 w-full flex flex-col space-y-4 items-center overflow-y-hidden">
				<div className="w-full max-w-2xl flex flex-col space-y-4">
					<Card
						className="h-[90vh]"
						title={currentItem?.name === ".inbox" ? "Inbox" : currentItem?.name}
					>
						<TextInput
							forwardRef={createInputRef}
							id="add-to-inbox"
							label=""
							value={newItem}
							onInput={e => setNewItem(e.target.value)}
							onKeyDown={e => {
								if (e.key === "Enter" && newItem && currentItem) {
									commands.emit<cmd.data.create>("data.create", {
										name: newItem,
										parent: currentItem.fsid,
									})

									setNewItem("")
								}
							}}
							placeholder={tAddToInboxInputPlaceholder}
						/>

						<GTDList items={children} />
					</Card>
				</div>
			</div>
		</CenteredPage>
	)
}
