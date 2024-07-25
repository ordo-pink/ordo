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

import { BsInbox } from "react-icons/bs"
import { HiOutlineSparkles } from "react-icons/hi"

import { useCurrentRoute } from "@ordo-pink/frontend-react-hooks"

import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"
import Heading from "@ordo-pink/frontend-react-components/heading"

import { useInbox } from "../hooks/use-inbox.hook"
import { useProjects } from "../hooks/use-projects.hook"

import GTDSidebarProject from "../components/sidebar-project.component"

export default function GTDSidebar() {
	const route = useCurrentRoute()
	// const commands = useCommands()
	// const data = useData()
	// const { label } = useRouteParams<{ label: string }>()
	const inboxItems = useInbox()
	const projects = useProjects()
	// const state = useExtensionState<{ pinnedLabels: string[] }>("gtd")

	return (
		<div className="mt-8 flex flex-col space-y-8 px-1">
			<ActionListItem
				large
				href="/gtd"
				Icon={BsInbox}
				current={route?.path === "/gtd"}
				text="Входящие"
			>
				<div className="flex items-center space-x-2 text-xs">
					<div>{inboxItems.length > 0 ? inboxItems.length : <HiOutlineSparkles />}</div>
				</div>
			</ActionListItem>

			<div className="flex flex-col space-y-2">
				<Heading level="5" center uppercase styled_first_letter>
					проекты
				</Heading>
				<div>
					{projects.map(project => (
						<GTDSidebarProject key={project.fsid} fsid={project.fsid} />
					))}
				</div>
			</div>

			{/* <div className="flex flex-col space-y-2">
				<div className="flex justify-between items-center w-full">
					<div className="grow">
						<Heading level="5" center uppercase styledFirstLetter>
							Закреплённые метки
						</Heading>
					</div>
					<OrdoButton.Secondary
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
					</OrdoButton.Secondary>
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
			</div> */}
		</div>
	)
}
