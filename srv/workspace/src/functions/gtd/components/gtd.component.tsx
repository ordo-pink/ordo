// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Card from "$components/card.component"
import { CenteredPage } from "$components/centered-page"
import { TextInput } from "$components/input"
import { Title } from "$components/page-header"
import { PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { Nullable } from "@ordo-pink/tau"
import { useEffect, useState } from "react"

export default function GTD() {
	const { commands, currentRoute, metadata } = useSharedContext()
	const [currentItem, setCurrentItem] = useState<Nullable<PlainData>>(null)
	const [children, setChildren] = useState<PlainData[]>([])
	const gtdDirectory = metadata?.find(item => item.name === ".gtd" && item.parent === null)

	useEffect(() => {
		if (!metadata || !currentRoute) return

		const gtd = metadata.find(item => item.name === ".gtd" && item.parent === null)
		console.log(metadata)

		const currentItem = metadata.find(item =>
			currentRoute.path === "/gtd"
				? item.name === ".inbox" && item.parent === gtd?.fsid
				: item.name === currentRoute.path.slice(14) && item.parent === gtd?.fsid,
		)

		console.log(currentItem)

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
		<CenteredPage centerX>
			<div className="px-4 py-8 w-full flex flex-col space-y-4 items-center">
				<div className="w-full max-w-2xl flex flex-col space-y-4">
					<Card>
						<TextInput id="add-to-inbox" label="" placeholder={tAddToInboxInputPlaceholder} />
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
												id={child.fsid}
											/>
											<label htmlFor={child.fsid}>{child.name}</label>
										</div>
									</div>
							  ))}
					</Card>
				</div>
			</div>
		</CenteredPage>
	)
}
