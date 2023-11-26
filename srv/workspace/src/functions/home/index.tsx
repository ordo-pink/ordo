// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import Card from "$components/card.component"
import { CenteredPage } from "$components/centered-page"
import { Title } from "$components/page-header"
import { useStrictSubscription } from "$hooks/use-subscription"
import { __Activities$ } from "$streams/activities"
import { Extensions, ComponentSpace, Functions, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { Nullable } from "@ordo-pink/tau"
import { memo } from "react"
import { BsCollection } from "react-icons/bs"

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
		<CenteredPage centerX>
			<div className="my-8">
				<Title level="1">Welcome to Ordo!</Title>
			</div>
			<div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-8">
				<Card title="Announcements" className="row-span-3">
					<p>TODO: Announcements</p>
				</Card>

				{activities
					.filter(activity => activity.name !== "home")
					.map(Activity => (
						<Card key={Activity.name}>
							<Activity.Component commands={commands} space={ComponentSpace.WIDGET} />
						</Card>
					))}
			</div>
		</CenteredPage>
	)
}
