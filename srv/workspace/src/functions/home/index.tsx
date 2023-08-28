// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Card from "$components/card.component"
import { CenteredPage } from "$components/centered-page"
import { Title } from "$components/page-header"
import { createOrdoFunction } from "$utils/create-function.util"
import { Activity, ComponentSpace, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { memo, useEffect } from "react"
import { BsCollection } from "react-icons/bs"

export default function createHomeFunction() {
	return createOrdoFunction(commands => {
		commands.emit<cmd.activities.add>("activities.add", {
			Component: HomeActivity,
			name: "home",
			routes: ["/"],
		})

		commands.emit<cmd.commandPalette.add>("command-palette.add", {
			id: "home.navigate",
			readableName: "Go to Welcome Screen",
			accelerator: "mod+h",
			Icon,
			onSelect: () => commands.emit<cmd.router.navigate>("router.navigate", "/"),
		})
	})
}

const WelcomePage = ({ commands, space }: Activity.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <Icon />)
		.default(() => <Workspace commands={commands} />)

const HomeActivity = memo(WelcomePage, (prev, next) => prev.space === next.space)

const Icon = () => <BsCollection />

const Workspace = ({ commands }: Pick<Activity.ComponentProps, "commands">) => {
	useEffect(() => {
		commands.emit<cmd.sidebar.disable>("sidebar.disable")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<CenteredPage centerX>
			<div className="my-8">
				<Title level="1">Welcome to Ordo!</Title>
			</div>
			<div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-8">
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
