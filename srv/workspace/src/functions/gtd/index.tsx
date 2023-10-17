// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Extensions, ComponentSpace, Functions, cmd } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import GTDIcon from "./components/gtd-icon.component"
import GDTCard from "./components/gtd-card.component"
import GTDSidebar from "./components/gtd-sidebar.component"
import GTD from "./components/gtd.component"
import { BsInbox, BsLightbulb } from "react-icons/bs"
import { GTDCommands } from "./types"
import GTDWidget from "./components/gtd-widget.component"

export default function createGTDFunction({ commands }: Functions.CreateFunctionParams) {
	commands.emit<cmd.activities.add>("activities.add", {
		Component,
		Sidebar: GTDSidebar,
		name: "gtd",
		routes: ["/gtd", "/gtd/projects/:project", "/gtd/labels/:label"],
		background: false,
	})

	commands.on<GTDCommands.openInbox>("gtd.open-inbox", () =>
		commands.emit<cmd.router.navigate>("router.navigate", "/gtd"),
	)

	commands.on<GTDCommands.openItem>("gtd.open-item", fsid =>
		commands.emit<cmd.router.navigate>("router.navigate", `/fsid/items/${fsid}`),
	)

	commands.on<GTDCommands.markDone>("gtd.mark-done", ({ payload }) =>
		commands.emit<cmd.data.addLabel>("data.add-label", { item: payload, label: "done" }),
	)

	commands.on<GTDCommands.markNotDone>("gtd.mark-not-done", ({ payload }) =>
		commands.emit<cmd.data.removeLabel>("data.remove-label", { item: payload, label: "done" }),
	)

	commands.on<GTDCommands.showAddReminderModal>("gtd.show-quick-reminder-modal", () =>
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => (
				<div className="w-96 max-w-lg p-8">
					<GTDWidget />
				</div>
			),
		}),
	)

	commands.on<GTDCommands.addQuickReminder>("gtd.add-quick-reminder", ({ payload }) => {
		commands.emit<cmd.data.create>("data.create", { name: payload.name, parent: payload.inboxFsid })
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "gtd.open-inbox",
		onSelect: () => {
			commands.emit<GTDCommands.openInbox>("gtd.open-inbox")
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
		},
		Icon: BsInbox,
		readableName: "Open GTD Inbox",
		accelerator: "mod+i",
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "gtd.add-reminder",
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<GTDCommands.showAddReminderModal>("gtd.show-quick-reminder-modal")
		},
		Icon: BsLightbulb,
		readableName: "Quick reminder",
		accelerator: "meta+mod+n",
	})
}

const Component = ({ space }: Extensions.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, GTDIcon)
		.case(ComponentSpace.CARD, GDTCard)
		.case(ComponentSpace.WIDGET, GTDWidget)
		.default(GTD)
