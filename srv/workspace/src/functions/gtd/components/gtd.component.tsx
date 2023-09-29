// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Card from "$components/card.component"
import { CenteredPage } from "$components/centered-page"
import { TextInput } from "$components/input"
import { useAccelerator } from "$hooks/use-accelerator"
import { PlainData } from "@ordo-pink/data"
import { Commands, cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { Nullable, noop } from "@ordo-pink/tau"
import { useEffect, useRef, useState } from "react"
import GTDList from "./gtd-list.component"
import { GTDCommands } from "../types"
import { GTDCtxMenu } from "../context-menu-items"
import { Either } from "@ordo-pink/either"
import { useChildren } from "$hooks/use-children"
import Null from "$components/null"

export default function GTD() {
	const { commands, route, data } = useSharedContext()
	const [currentItem, setCurrentItem] = useState<Nullable<PlainData>>(null)
	const children = useChildren(currentItem?.fsid ?? null)
	const [newItem, setNewItem] = useState("")
	const gtdDirectory = data?.find(item => item.name === ".gtd" && item.parent === null)
	const createInputRef = useRef<HTMLInputElement>(null)

	useAccelerator("meta+n", () => createInputRef.current?.focus())

	useEffect(() => {
		const handleRedirectOnRemove: Commands.Handler<PlainData> = ({ payload }) =>
			route?.params?.item === payload.fsid && commands.emit<GTDCommands.openInbox>("gtd.open-inbox")

		const handleShowMovePalette = GTDCtxMenu.move(data, commands)

		commands.on<cmd.data.remove>("data.remove", handleRedirectOnRemove)
		commands.emit<cmd.ctxMenu.add>("context-menu.add", GTDCtxMenu.rename)
		commands.emit<cmd.ctxMenu.add>("context-menu.add", GTDCtxMenu.addLabelPalette)
		commands.emit<cmd.ctxMenu.add>("context-menu.add", GTDCtxMenu.removeLabelPalette)
		commands.emit<cmd.ctxMenu.add>("context-menu.add", GTDCtxMenu.createModal)
		commands.emit<cmd.ctxMenu.add>("context-menu.add", handleShowMovePalette)

		return () => {
			commands.off<cmd.data.remove>("data.remove", handleRedirectOnRemove)
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", GTDCtxMenu.rename.cmd)
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", GTDCtxMenu.addLabelPalette.cmd)
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", GTDCtxMenu.removeLabelPalette.cmd)
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", GTDCtxMenu.createModal.cmd)
			commands.emit<cmd.ctxMenu.remove>("context-menu.remove", handleShowMovePalette.cmd)
		}
	}, [commands, data, route?.params?.item])

	useEffect(() => {
		Either.fromNullable(data)
			.chain(data =>
				Either.fromNullable(route).chain(route =>
					Either.fromNullable(data.find(item => item.name === ".gtd" && item.parent === null)).map(
						gtd => ({ data, route, gtd }),
					),
				),
			)
			.chain(({ gtd, data, route }) =>
				Either.fromNullable(
					data.find(item =>
						route.path === "/gtd"
							? item.name === ".inbox" && item.parent === gtd?.fsid
							: item.fsid === route.params.item,
					),
				),
			)
			.fold(noop, setCurrentItem)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [route, gtdDirectory, data])

	const tAddToInboxInputPlaceholder = "Sell milk..."

	return Either.fromNullable(currentItem).fold(Null, currentItem => (
		<CenteredPage centerX centerY>
			<div className="px-4 py-8 w-full flex flex-col space-y-4 items-center overflow-y-hidden">
				<div className="w-full max-w-2xl flex flex-col space-y-4">
					<Card
						className="h-[90vh]"
						title={currentItem.name === ".inbox" ? "Inbox" : currentItem.name}
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
	))
}
