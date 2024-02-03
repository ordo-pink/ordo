// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Card from "$components/card.component"
import { CenteredPage } from "$components/centered-page"
import { useStrictSubscription } from "$hooks/use-subscription"
import { __Activities$ } from "$streams/activities"
import { Extensions, ComponentSpace, Functions } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { Nullable } from "@ordo-pink/tau"
import { memo } from "react"
import { BsCollection } from "react-icons/bs"

const announcements = [
	{
		title: "🎉 Ordo.pink Beta",
		message: "Ordo.pink наконец вышел в публичную бета-версию!",
		date: "2024-02-03",
	},
]

type Params = Functions.CreateFunctionParams & { activities$: Nullable<__Activities$> }
export default function createHomeFunction({ commands, activities$ }: Params) {
	commands.emit<cmd.activities.add>("activities.add", {
		Component: props => <HomeActivity activities$={activities$} {...props} />,
		name: "home",
		routes: ["/"],
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "home.navigate",
		readableName: "Перейти на главную",
		accelerator: "mod+h",
		Icon,
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.router.navigate>("router.navigate", "/")
		},
	})
}

type P = Extensions.ComponentProps & { activities$: Nullable<__Activities$> }
const WelcomePage = ({ commands, space, activities$ }: P) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, () => <Icon />)
		.default(() => <Workspace commands={commands} activities$={activities$} />)

const HomeActivity = memo(WelcomePage, (prev, next) => prev.space === next.space)

const Icon = () => <BsCollection />

const Workspace = ({ commands, activities$ }: Pick<P, "commands" | "activities$">) => {
	const activities = useStrictSubscription(activities$, [])

	return (
		<CenteredPage centerX centerY>
			<div className="container grid overflow-x-hidden grid-cols-1 gap-4 px-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
				<Card title="Новости" className="row-span-2">
					{announcements.map(announcement => (
						<div key={announcement.title}>
							<div className="flex flex-wrap justify-between items-center mb-1 space-x-2">
								<h4 className="text-xl font-bold">{announcement.title}</h4>
								<dt className="text-xs text-neutral-500">{announcement.date}</dt>
							</div>
							<p>{announcement.message}</p>
						</div>
					))}
				</Card>

				{activities
					.filter(
						activity =>
							activity.name !== "home" && activity.name !== "user" && activity.name !== "editor",
					)
					.sort((a, b) => a.name.localeCompare(b.name))
					.map(Activity => (
						<Card key={Activity.name}>
							<Activity.Component commands={commands} space={ComponentSpace.WIDGET} />
						</Card>
					))}
			</div>
		</CenteredPage>
	)
}
