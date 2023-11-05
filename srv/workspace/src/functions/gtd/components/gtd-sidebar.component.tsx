// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import ActionListItem from "$components/action-list-item"
import { OrdoButtonSecondary } from "$components/buttons/buttons"
import { Title } from "$components/page-header"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { BsFolder2Open, BsInbox, BsPlus } from "react-icons/bs"
import { HiOutlineSparkles } from "react-icons/hi"
import { useDataFind } from "$hooks/use-data.hook"
import { useGtdProjects } from "../hooks/use-projects"
import { useInbox } from "../hooks/use-inbox"

export default function GTDSidebar() {
	const { route, commands } = useSharedContext()
	const gtd = useDataFind(item => item.name === ".gtd" && item.parent === null)
	const inboxItems = useInbox()
	const projects = useGtdProjects()
	// const pinned = useDataFind(item => !!gtd && item.name === ".pinned" && item.parent === gtd.fsid)

	return (
		<div className="mt-8 flex flex-col space-y-8">
			<ActionListItem
				large
				// onContextMenu={event =>
				// 	commands.emit<cmd.ctxMenu.show>("context-menu.show", {
				// 		event,
				// 		payload: inboxItems,
				// 		hideDeleteItems: true,
				// 	})
				// }
				href="/gtd"
				Icon={BsInbox}
				current={route?.path === "/gtd"}
				text="Inbox"
			>
				<div className={`text-xs flex space-x-2 items-center`}>
					<div>{inboxItems.length > 0 ? inboxItems.length : <HiOutlineSparkles />}</div>
				</div>
			</ActionListItem>

			<div className="flex flex-col space-y-2">
				<Title level="5" center uppercase styledFirstLetter>
					Projects
				</Title>
				<div>
					{projects.map(project => (
						<ActionListItem
							large
							key={project}
							Icon={BsFolder2Open}
							current={decodeURIComponent(route?.params?.project ?? "") === project}
							text={project}
							href={`/gtd/projects/${project}`}
						/>
					))}
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

			{/* <div className="flex flex-col space-y-2">
				<Title level="5" center uppercase styledFirstLetter>
					Pinned Labels
				</Title>
				<div>
					{pinned?.labels.map(label => (
						<ActionListItem
							Icon={BsTag}
							key={label}
							current={decodeURIComponent(route?.params?.label ?? "") === label}
							text={label}
							href={`/gtd/labels/${label}`}
						/>
					))}
				</div>

				<OrdoButtonSecondary
					className="text-lg"
					center
					title="Add Pinned Label"
					compact
					onClick={() =>
						commands.emit<cmd.data.showEditLabelsPalette>("data.show-edit-labels-palette", pinned!)
					}
				>
					<BsPlus className="text-lg" />
				</OrdoButtonSecondary>
			</div> */}
		</div>
	)
}
