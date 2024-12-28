/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { NotificationType } from "@ordo-pink/core"

import { OrdoSidebarStatus } from "./sidebar/sidebar.constants"
import { ordo_app_state } from "../../app.state"

export const OrdoWorkspace = Maoka.create("main", ({ use }) => {
	use(MaokaJabs.set_class("workspace"))

	const commands = ordo_app_state.zags.select("commands")
	const get_sidebar_status = use(ordo_app_state.select_jab$("sections.sidebar.status"))

	return () => {
		const status = get_sidebar_status()

		if (status !== OrdoSidebarStatus.VISIBLE) use(MaokaJabs.add_class("no-sidebar"))
		else use(MaokaJabs.remove_class("no-sidebar"))

		return TestWrapper(() => [
			Maoka.create("button", ({ use }) => {
				const commands = ordo_app_state.zags.select("commands")
				const modal = Maoka.create("div", () => () => "MODAL TEST TEXT")

				const render = (div: HTMLDivElement) => Maoka.render_dom(div, modal)
				const on_unmount = () => console.log("MODAL UNMOUNT TEST")

				use(MaokaJabs.listen("onclick", () => commands.emit("cmd.application.modal.show", { render, on_unmount })))

				return () => "MODAL TEST"
			}),

			Maoka.create("button", ({ use }) => {
				use(MaokaJabs.listen("onclick", () => commands.emit("cmd.application.background_task.start_saving")))

				return () => "BACKGROUND SAVING"
			}),

			Maoka.create("button", ({ use }) => {
				use(MaokaJabs.listen("onclick", () => commands.emit("cmd.application.background_task.start_loading")))

				return () => "BACKGROUND LOADING"
			}),

			Maoka.create("button", ({ use }) => {
				use(MaokaJabs.listen("onclick", () => commands.emit("cmd.application.background_task.reset_status")))

				return () => "BACKGROUND DONE"
			}),

			Maoka.create("button", ({ use }) => {
				use(MaokaJabs.listen("onclick", () => commands.emit("cmd.application.sidebar.toggle")))

				return () => "SIDEBAR TOGGLE TEST"
			}),

			Maoka.create("button", ({ use }) => {
				use(MaokaJabs.listen("onclick", () => commands.emit("cmd.application.sidebar.enable")))

				return () => "SIDEBAR ENABLE TEST"
			}),

			Maoka.create("button", ({ use }) => {
				use(MaokaJabs.listen("onclick", () => commands.emit("cmd.application.sidebar.disable")))

				return () => "SIDEBAR DISABLE TEST"
			}),

			Maoka.create("button", ({ use }) => {
				const message = "Lorem ipsum" as any

				use(
					MaokaJabs.listen("onclick", () => {
						commands.emit("cmd.application.notification.show", { message, duration: 3, type: NotificationType.DEFAULT })
						commands.emit("cmd.application.notification.show", { message, type: NotificationType.INFO })
						commands.emit("cmd.application.notification.show", { message, duration: 7, type: NotificationType.QUESTION })
						commands.emit("cmd.application.notification.show", { message, duration: 9, type: NotificationType.RRR })
						commands.emit("cmd.application.notification.show", { message, duration: 7, type: NotificationType.SUCCESS })
						commands.emit("cmd.application.notification.show", { message, type: NotificationType.WARN })
					}),
				)

				return () => "NOTIFICATIONS TEST"
			}),

			Lorem,
		])
	}
})

const TestWrapper = Maoka.styled("div", { class: "flex flex-col items-start p-4" })

const Lorem = Maoka.create(
	"p",
	() => () =>
		"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
)
