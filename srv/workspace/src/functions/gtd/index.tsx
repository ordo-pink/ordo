// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Extensions, ComponentSpace, Functions } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import GTDIcon from "./components/gtd-icon.component"
import GTDSidebar from "./components/gtd-sidebar.component"
import GTD from "./components/gtd.component"
import {
	BsCheckSquare,
	BsInbox,
	BsLightbulb,
	BsListCheck,
	BsSquare,
	BsUiChecks,
} from "react-icons/bs"
import GTDWidget from "./components/gtd-widget.component"
import "./gtd.types"
import { Either } from "@ordo-pink/either"
import { PlainData } from "@ordo-pink/data"
import { noop } from "@ordo-pink/tau"

export default function createGTDFunction({ commands, data$ }: Functions.CreateFunctionParams) {
	commands.emit<cmd.activities.add>("activities.add", {
		Component,
		Sidebar: GTDSidebar,
		name: "gtd",
		routes: ["/gtd", "/gtd/projects/:fsid", "/gtd/labels/:label"],
		background: false,
	})

	commands.on<cmd.gtd.openInbox>("gtd.open-inbox", () =>
		commands.emit<cmd.router.navigate>("router.navigate", "/gtd"),
	)

	commands.on<cmd.gtd.openItem>("gtd.open-item", ({ payload }) =>
		commands.emit<cmd.router.navigate>("router.navigate", `/gtd/items/${payload}`),
	)

	commands.on<cmd.gtd.showInGTD>("gtd.show-in-gtd", ({ payload }) => {
		const data = (data$ as any).value as PlainData[]
		const item = data.find(item => item.fsid === payload)

		if (!item) return

		const children = data.filter(child => child.parent === item.fsid)

		if (children.length === 0 && !item.parent) return

		console.log(children.length)

		commands.emit<cmd.gtd.openItem>("gtd.open-item", children.length > 0 ? item.fsid : item.parent!)
	})

	commands.on<cmd.gtd.addToGTD>("gtd.add-to-gtd", ({ payload }) =>
		Either.of((data$ as any).value as PlainData[])
			.chain(data =>
				Either.fromNullable(
					data.find(item => item.fsid === payload && !item.labels.includes("gtd")),
				),
			)
			.fold(noop, item =>
				commands.emit<cmd.data.addLabel>("data.add-label", { item, label: "gtd" }),
			),
	)

	commands.on<cmd.gtd.removeFromGTD>("gtd.remove-from-gtd", ({ payload }) =>
		Either.of((data$ as any).value as PlainData[])
			.chain(data =>
				Either.fromNullable(
					data.find(item => item.fsid === payload && item.labels.includes("gtd")),
				),
			)
			.fold(noop, item =>
				commands.emit<cmd.data.removeLabel>("data.remove-label", { item, label: "gtd" }),
			),
	)

	commands.on<cmd.gtd.markDone>("gtd.mark-done", ({ payload }) =>
		Either.of((data$ as any).value as PlainData[])
			.chain(data =>
				Either.fromNullable(
					data.find(item => item.fsid === payload && !item.labels.includes("done")),
				),
			)
			.fold(noop, item =>
				commands.emit<cmd.data.addLabel>("data.add-label", { item, label: "done" }),
			),
	)

	commands.on<cmd.gtd.markNotDone>("gtd.mark-not-done", ({ payload }) =>
		Either.of((data$ as any).value as PlainData[])
			.chain(data =>
				Either.fromNullable(
					data.find(item => item.fsid === payload && item.labels.includes("done")),
				),
			)
			.fold(noop, item =>
				commands.emit<cmd.data.removeLabel>("data.remove-label", { item, label: "done" }),
			),
	)

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "gtd.show-in-gtd",
		Icon: BsListCheck,
		readableName: "Показать в задачах",
		type: "read",
		shouldShow: ({ payload }) => payload && payload.fsid,
		accelerator: "mod+g",
		payloadCreator: ({ payload }) => payload?.fsid,
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "gtd.add-to-gtd",
		Icon: BsUiChecks,
		readableName: "Добавить проект в задачи",
		type: "create",
		shouldShow: ({ payload }) => {
			const data = (data$ as any).value as PlainData[]
			const children = data.filter(item => item.parent === payload?.fsid)

			return (
				payload &&
				payload.fsid &&
				payload.labels &&
				Array.isArray(payload.labels) &&
				!payload.labels.includes("gtd") &&
				children.length > 0
			)
		},
		accelerator: "Enter",
		payloadCreator: ({ payload }) => payload.fsid,
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "gtd.remove-from-gtd",
		Icon: BsInbox,
		readableName: "Убрать из дел",
		type: "delete",
		shouldShow: ({ payload }) =>
			payload &&
			payload.fsid &&
			payload.labels &&
			Array.isArray(payload.labels) &&
			payload.labels.includes("gtd"),
		accelerator: "Backspace",
		payloadCreator: ({ payload }) => payload.fsid,
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "gtd.mark-done",
		Icon: BsCheckSquare,
		readableName: "Отметить как выполненное",
		type: "update",
		shouldShow: ({ payload }) =>
			payload &&
			payload.fsid &&
			payload.labels &&
			Array.isArray(payload.labels) &&
			payload.labels.includes("gtd") &&
			!payload.labels.includes("done"),
		accelerator: "Enter",
		payloadCreator: ({ payload }) => payload.fsid,
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "gtd.mark-not-done",
		Icon: BsSquare,
		readableName: "Отметить как выполненное",
		type: "update",
		shouldShow: ({ payload }) =>
			payload &&
			payload.fsid &&
			payload.labels &&
			Array.isArray(payload.labels) &&
			payload.labels.includes("gtd") &&
			payload.labels.includes("done"),
		accelerator: "Enter",
		payloadCreator: ({ payload }) => payload.fsid,
	})

	commands.on<cmd.gtd.showAddReminderModal>("gtd.show-quick-reminder-modal", () =>
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => (
				<div className="w-96 max-w-lg p-8">
					<GTDWidget />
				</div>
			),
		}),
	)

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "gtd.open-inbox",
		onSelect: () => {
			commands.emit<cmd.gtd.openInbox>("gtd.open-inbox")
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
		},
		Icon: BsInbox,
		readableName: "Перейти во задачи",
		accelerator: "mod+i",
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "gtd.add-reminder",
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.gtd.showAddReminderModal>("gtd.show-quick-reminder-modal")
		},
		Icon: BsLightbulb,
		readableName: "Создать быстрое напоминание",
		accelerator: "meta+mod+n",
	})
}

const Component = ({ space }: Extensions.ComponentProps) =>
	Switch.of(space)
		.case(ComponentSpace.ICON, GTDIcon)
		.case(ComponentSpace.WIDGET, GTDWidget)
		.default(GTD)
