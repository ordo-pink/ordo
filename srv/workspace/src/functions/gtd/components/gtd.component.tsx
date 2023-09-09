// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { OrdoButtonSecondary } from "$components/buttons/buttons"
import Card from "$components/card.component"
import { CenteredPage } from "$components/centered-page"
import { TextInput } from "$components/input"
import { useAccelerator } from "$hooks/use-accelerator"
import { PlainData } from "@ordo-pink/data"
import { cmd, useSharedContext } from "@ordo-pink/frontend-core"
import { Nullable } from "@ordo-pink/tau"
import { useEffect, useRef, useState } from "react"
import { BsPlus } from "react-icons/bs"

export default function GTD() {
	const { commands, currentRoute, metadata } = useSharedContext()
	const [currentItem, setCurrentItem] = useState<Nullable<PlainData>>(null)
	const [children, setChildren] = useState<PlainData[]>([])
	const gtdDirectory = metadata?.find(item => item.name === ".gtd" && item.parent === null)
	const createInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		commands.emit<cmd.commandPalette.add>("command-palette.add", {
			id: "add-gtd-task-to-current-list",
			onSelect: () => createInputRef.current?.focus(),
			readableName: "Add GTD task to current project",
			accelerator: "meta+n",
		})

		return () => {
			commands.emit<cmd.commandPalette.remove>(
				"command-palette.remove",
				"add-gtd-task-to-current-list",
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useAccelerator("meta+n", () => {
		createInputRef.current?.focus()
	})

	useEffect(() => {
		if (!metadata || !currentRoute) return

		const gtd = metadata.find(item => item.name === ".gtd" && item.parent === null)

		const currentItem = metadata.find(item =>
			currentRoute.path === "/gtd"
				? item.name === ".inbox" && item.parent === gtd?.fsid
				: item.name === currentRoute.path.slice(14) && item.parent === gtd?.fsid,
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

	console.log(currentItem)

	const tAddToInboxInputPlaceholder = "Sell milk..."

	return (
		<CenteredPage centerX>
			<div className="px-4 py-8 w-full flex flex-col space-y-4 items-center">
				<div className="w-full max-w-2xl flex flex-col space-y-4">
					<Card>
						<TextInput
							forwardRef={createInputRef}
							id="add-to-inbox"
							label=""
							placeholder={tAddToInboxInputPlaceholder}
						/>
					</Card>

					<Card title={currentItem?.name === ".inbox" ? "Inbox" : currentItem?.name}>
						{currentItem?.name === ".inbox"
							? children
									.filter(child => !child.children.length)
									.map(child => (
										<div key={child.fsid}>
											<div>
												<input type="checkbox" id={child.fsid} />
												<label htmlFor={child.fsid}>{child.name}</label>
											</div>
										</div>
									))
							: children.map(child => (
									<div key={child.fsid}>
										<div className="flex space-x-2 items-center">
											<input
												className="h-5 w-5 rounded-full shadow"
												type="checkbox"
												checked={child.labels.includes("done")}
												id={child.fsid}
												onChange={() =>
													child.labels.includes("done")
														? commands.emit<cmd.data.removeLabel>("data.remove-label", {
																item: child,
																label: "done",
														  })
														: commands.emit<cmd.data.addLabel>("data.add-label", {
																item: child,
																label: "done",
														  })
												}
											/>
											<label
												className={child.labels.includes("done") ? "line-through" : ""}
												htmlFor={child.fsid}
											>
												{child.name}
											</label>
										</div>
									</div>
							  ))}

						<OrdoButtonSecondary
							className="text-lg"
							center
							title="Add Project"
							compact
							onClick={() =>
								commands.emit<cmd.data.showCreateModal>("data.show-create-modal", currentItem)
							}
						>
							<BsPlus className="text-lg" />
						</OrdoButtonSecondary>
					</Card>
				</div>
			</div>
		</CenteredPage>
	)
}
