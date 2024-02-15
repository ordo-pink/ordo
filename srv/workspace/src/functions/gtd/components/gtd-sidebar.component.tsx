// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import ActionListItem from "$components/action-list-item"
import { Title } from "$components/page-header"
import { useSharedContext } from "@ordo-pink/core"
import { BsInbox, BsPencil, BsTag } from "react-icons/bs"
import { HiOutlineSparkles } from "react-icons/hi"
import { useGtdProjects } from "../hooks/use-projects"
import { useInbox } from "../hooks/use-inbox"
import { OrdoButtonSecondary } from "$components/buttons/buttons"
import { useExtensionState } from "$hooks/use-extension-state.hook"
import GTDSidebarProject from "./gtd-sidebar-project.component"
import { useRouteParams } from "$hooks/use-route-params.hook"

export default function GTDSidebar() {
	const { route, commands, data } = useSharedContext()
	const { label } = useRouteParams<{ label: string }>()
	const inboxItems = useInbox()
	const projects = useGtdProjects()
	const state = useExtensionState<{ pinnedLabels: string[] }>("gtd")

	return (
		<div className="mt-8 flex flex-col space-y-8 px-1">
			<ActionListItem
				large
				href="/gtd"
				Icon={BsInbox}
				current={route?.path === "/gtd"}
				text="Входящие"
			>
				<div className={`flex items-center space-x-2 text-xs`}>
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
					))}
				</div>
			</div>

			<div className="flex flex-col space-y-2">
				<div className="flex w-full items-center justify-between">
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

							if (labels.length === 0 && !state.pinnedLabels?.length) {
								commands.emit<cmd.notification.show>("notification.show", {
									type: "warn",
									title: "Ой!",
									message: "У вас пока нет меток, чтобы их закрепить.",
									duration: 5,
								})

								return
							}

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
					{state.pinnedLabels?.map(pinnedLabel => (
						<ActionListItem
							Icon={BsTag}
							key={pinnedLabel}
							current={decodeURIComponent(label ?? "") === pinnedLabel}
							text={pinnedLabel}
							href={`/gtd/labels/${pinnedLabel}`}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
