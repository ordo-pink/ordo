// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Activity, ComponentSpace, Functions, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import GTDIcon from "./components/gtd-icon.component"
import GDTCard from "./components/gtd-card.component"
import GTDSidebar from "./components/gtd-sidebar.component"
import GTD from "./components/gtd.component"
import { BsInbox } from "react-icons/bs"

export default function createGTDFunction({ commands }: Functions.CreateFunctionParams) {
	commands.emit<cmd.activities.add>("activities.add", {
		Component,
		Sidebar: GTDSidebar,
		name: "gtd",
		routes: [
			"/gtd",
			"/gtd/projects",
			"/gtd/projects/:project",
			"/gtd/labels/:label",
			"/gtd/today",
			"/gtd/this-week",
			"/gtd/this-month",
			"/gtd/this-year",
		],
		background: false,
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "gtd.open-inbox",
		onSelect: () => commands.emit<cmd.router.navigate>("router.navigate", "/gtd"),
		Icon: BsInbox,
		readableName: "Open GTD Inbox",
		accelerator: "mod+i",
	})
}

const Component = ({ space }: Activity.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, GTDIcon)
		.case(ComponentSpace.WIDGET, GDTCard)
		.default(GTD)
