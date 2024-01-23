// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import ActionListItem from "$components/action-list-item"
import { Title } from "$components/page-header"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { BsInbox, BsListCheck, BsPencil, BsTag } from "react-icons/bs"
import { HiOutlineSparkles } from "react-icons/hi"
import { useGtdProjects } from "../hooks/use-projects"
import { useInbox } from "../hooks/use-inbox"
import { useRouteParams } from "$hooks/use-route-params.hook"
import { FSID } from "@ordo-pink/data"
import { OrdoButtonSecondary } from "$components/buttons/buttons"
import { useExtensionState } from "$hooks/use-extension-state.hook"
import GTDSidebarProject from "./gtd-sidebar-project.component"

export default function GTDSidebar() {
	const { route, commands, data } = useSharedContext()
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const inboxItems = useInbox()
	const projects = useGtdProjects()
	const state = useExtensionState<{ pinnedLabels?: string[] }>("gtd")

	return (
		<div className="mt-8 flex flex-col space-y-8 px-1">
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
				text="Входящие"
			>
				<div className={`text-xs flex space-x-2 items-center`}>
					<div>{inboxItems.length > 0 ? inboxItems.length : <HiOutlineSparkles />}</div>
				</div>
			</ActionListItem>

			<div className="flex flex-col space-y-2">
				<Title level="5" center uppercase styledFirstLetter>
					проекты
				</Title>
				<div>
					{projects.map(project => (
						<GTDSidebarProject key={project.fsid} fsid={project.fsid} />
						// <ActionListItem
						// 	large
						// 	key={project.fsid}
						// 	Icon={BsListCheck}
						// 	current={fsid === project.fsid}
						// 	text={project.name}
						// 	href={`/gtd/projects/${project.fsid}`}
						// 	onContextMenu={event =>
						// 		commands.emit<cmd.ctxMenu.show>("context-menu.show", {
						// 			event,
						// 			payload: project,
						// 		})
						// 	}
						// />
					))}
				</div>

				{/* <OrdoButtonSecondary
					className="text-lg"
					center
					title="Добавить проект"
					compact
					onClick={() => commands.emit<cmd.data.showCreateModal>("data.show-create-modal", gtd)}
				>
					<BsPlus className="text-lg" />
				</OrdoButtonSecondary> */}
			</div>

			<div className="flex flex-col space-y-2">
				<div className="flex justify-between w-full items-center">
					<div className="flex-grow">
						<Title level="5" center uppercase styledFirstLetter>
							Закреплённые метки
						</Title>
					</div>
					<OrdoButtonSecondary
						title="Изменить закреплённые метки"
						compact
						onClick={() => {
							const labels = Array.from(new Set(data?.flatMap(item => item.labels)))
							commands.emit<cmd.commandPalette.show>("command-palette.show", {
								multiple: true,
								pinnedItems: state.pinnedLabels?.map(label => ({
									id: label,
									readableName: label,
									Icon: BsTag,
									onSelect: () => {
										commands.emit<cmd.extensionState.update>("extension-state.update", {
											name: "gtd",
											payload: {
												...state,
												pinnedLabels: state.pinnedLabels?.filter(l => l !== label) ?? [],
											},
										})
									},
								})),
								items: labels
									.filter(label => !state.pinnedLabels?.includes(label) && label !== "gtd")
									.map(label => ({
										id: label,
										readableName: label,
										Icon: BsTag,
										onSelect: () => {
											commands.emit<cmd.extensionState.update>("extension-state.update", {
												name: "gtd",
												payload: {
													...state,
													pinnedLabels: state.pinnedLabels
														? state.pinnedLabels.concat([label])
														: [label],
												},
											})
										},
									})),
							})
						}}
					>
						<BsPencil />
					</OrdoButtonSecondary>
				</div>

				<div>
					{state.pinnedLabels?.map(label => (
						<ActionListItem
							Icon={BsTag}
							key={label}
							current={decodeURIComponent(route?.params?.label ?? "") === label}
							text={label}
							href={`/gtd/labels/${label}`}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
