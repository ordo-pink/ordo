// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Card from "$components/card.component"
import { CenteredPage } from "$components/centered-page"
import { Title } from "$components/page-header"
import { getCommands } from "$streams/commands"
import { cmd } from "@ordo-pink/frontend-core"
import { useEffect } from "react"

const commands = getCommands()

export default function WelcomePage() {
	useEffect(() => {
		commands.emit<cmd.sidebar.disable>("sidebar.disable")
	}, [])

	return (
		<CenteredPage centerX centerY>
			<div className="mb-8">
				<Title level="1">Welcome to Ordo!</Title>
			</div>
			<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-8">
				<Card title="Announcements" className="row-span-3">
					<p>TODO: Announcements</p>
				</Card>
				<Card title="Hello!">
					<p>TODO: Welcome message</p>
				</Card>

				<Card title="Stats" className="row-span-2">
					TODO: Stats
				</Card>
				<Card title="Quick actions">
					<p>TODO: Keyboard shortcuts</p>
				</Card>

				<Card title="Useful links">TODO: Useful links</Card>
			</div>
		</CenteredPage>
	)
}
