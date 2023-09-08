// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import ActionListItem from "$components/action-list-item"
import { OrdoButtonSecondary } from "$components/buttons/buttons"
import { Loading } from "$components/loading/loading"
import Null from "$components/null"
import { Title } from "$components/page-header"
import { PlainData } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { Nullable } from "@ordo-pink/tau"
import { useEffect, useState } from "react"
import { BsFolder, BsInbox, BsPlus } from "react-icons/bs"

export default function GTDSidebar() {
	const { currentRoute, metadata, commands } = useSharedContext()
	const [gtd, setGtd] = useState<Nullable<PlainData>>(null)
	const [inbox, setInbox] = useState<Nullable<PlainData>>(null)

	useEffect(() => {
		if (!metadata) return
		const gtdDirectory = metadata.find(item => item.name === ".gtd" && item.parent === null)
		if (!gtdDirectory)
			return commands.emit<cmd.data.create>("data.create", { name: ".gtd", parent: null })
		setGtd(gtdDirectory)
		const inboxDirectory = metadata.find(
			item => item.name === ".inbox" && item.parent === gtdDirectory.fsid,
		)

		if (!inboxDirectory)
			return commands.emit<cmd.data.create>("data.create", {
				name: ".inbox",
				parent: gtdDirectory.fsid,
			})
		setInbox(inboxDirectory)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [metadata])

	return Either.fromNullable(inbox).fold(Loading, inbox => (
		<div className="mt-8 flex flex-col space-y-8">
			<ActionListItem
				large
				onContextMenu={event =>
					commands.emit<cmd.contextMenu.show>("context-menu.show", {
						event,
						payload: inbox,
						hideDeleteItems: true,
					})
				}
				href="/gtd"
				Icon={BsInbox}
				current={currentRoute?.path === "/gtd"}
				text="Inbox"
			/>

			<div className="flex flex-col space-y-2">
				<Title level="5" center uppercase styledFirstLetter>
					Projects
				</Title>
				<div>
					{gtd!.children
						.filter(item => item !== inbox.fsid)
						.map((child, index) =>
							Either.fromNullable(metadata?.find(item => item.fsid === child)).fold(Null, item => (
								<ActionListItem
									onContextMenu={event =>
										commands.emit<cmd.contextMenu.show>("context-menu.show", {
											event,
											payload: item,
										})
									}
									large
									key={item.fsid}
									href={`/gtd/projects/${encodeURIComponent(item.name)}`}
									Icon={BsFolder}
									current={currentRoute?.path === `/gtd/projects/${encodeURIComponent(item.name)}`}
									text={item.name}
								/>
							)),
						)}
				</div>

				<OrdoButtonSecondary
					className="text-lg"
					center
					title="Add Project"
					compact
					onClick={() => commands.emit<cmd.data.showCreateModal>("data.show-create-modal", gtd)}
				>
					<BsPlus className="text-lg" />
				</OrdoButtonSecondary>
			</div>
		</div>
	))
}
