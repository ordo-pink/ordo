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

import { NotificationType, create_function } from "@ordo-pink/core"
import { BsFileEarmarkBinary } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { TwoLetterLocale } from "@ordo-pink/locale"

declare global {
	interface t {
		test: {
			title: () => string
		}
	}
}

export default create_function(
	"pink.ordo.test",
	{
		queries: ["metadata.get_by_fsid", "metadata.get"],
		commands: [
			"cmd.application.add_translations",
			"cmd.application.background_task.reset_status",
			"cmd.application.background_task.set_status",
			"cmd.application.background_task.start_loading",
			"cmd.application.background_task.start_saving",
			"cmd.application.modal.show",
			"cmd.application.notification.show",
			"cmd.application.set_title",
			"cmd.application.sidebar.disable",
			"cmd.application.sidebar.enable",
			"cmd.application.sidebar.hide",
			"cmd.application.sidebar.show",
			"cmd.application.sidebar.toggle",
			"cmd.functions.activities.register",
		],
	},
	state => {
		const commands = state.commands
		commands.emit("cmd.functions.activities.register", {
			name: "pink.ordo.test",
			routes: [test_activity_route],
			render_icon: span => void span.appendChild(TestActivityIcon),
			render_workspace: div =>
				Maoka.render_dom(
					div,
					MaokaOrdo.Components.WithState(state, () => TestActivityWorkspace),
				),
		})
	},
)

const test_activity_route = "/test"

const TestActivityIcon = BsFileEarmarkBinary() as SVGSVGElement
const TestActivityWorkspace = Maoka.create("div", ({ use }) => {
	const commands = use(MaokaOrdo.Jabs.get_commands)

	commands.emit("cmd.application.add_translations", {
		lang: TwoLetterLocale.ENGLISH,
		translations: {
			"t.test.title": "It's like Todd's test room, but in",
		},
	})

	commands.emit("cmd.application.set_title", "t.test.title")

	return () => {
		return TestWrapper(() => [
			Maoka.create("button", ({ use }) => {
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
