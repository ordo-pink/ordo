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

import { BsCollection, BsEnvelopeAt, BsQuestionOctagon, BsSendCheck } from "@ordo-pink/frontend-icons"
import { CommandPaletteItemType, create_function } from "@ordo-pink/core"
import { TwoLetterLocale } from "@ordo-pink/locale"

import { WelcomeWorkspace } from "./welcome.workspace"

export default create_function(
	"pink.ordo.welcome",
	{
		queries: ["user.get_current", "metadata.get", "metadata.$", "metadata.get_by_name"],
		commands: [
			"cmd.application.add_translations",
			"cmd.application.background_task.reset_status",
			"cmd.application.background_task.start_loading",
			"cmd.application.command_palette.add",
			"cmd.application.command_palette.hide",
			"cmd.application.command_palette.show",
			"cmd.application.modal.hide",
			"cmd.application.modal.show",
			"cmd.application.notification.show",
			"cmd.application.router.navigate",
			"cmd.application.router.open_external",
			"cmd.application.set_title",
			"cmd.auth.show_request_code_modal",
			"cmd.auth.show_validate_code_modal",
			"cmd.content.set",
			"cmd.file_editor.open",
			"cmd.functions.activities.register",
			"cmd.metadata.create",
			"cmd.welcome.go_to_email_support",
			"cmd.welcome.go_to_messenger_support",
			"cmd.welcome.go_to_welcome_page",
			"cmd.welcome.open_support_palette",
		],
	},
	state => {
		const commands = state.commands
		const translate = state.translate

		commands.emit("cmd.application.add_translations", {
			lang: TwoLetterLocale.ENGLISH,
			translations: {
				"t.welcome.go_to_welcome_page": "Open welcome page",
				"t.welcome.landing_page.cookie_banner.message": "Wait, what?!",
				"t.welcome.landing_page.cookie_banner.title": "We don't use cookies",
				"t.welcome.landing_page.sections.hero.beta_started_announcement": "public beta is live!",
				"t.welcome.landing_page.title": "One space for docs, files and projects",
				"t.welcome.start_page.news_widget.title": "News",
				"t.welcome.start_page.title": "Welcome back!",
				"t.welcome.command_palette.support.email": "Contact via email",
				"t.welcome.command_palette.support.messenger": "Contact via messenger",
				"t.welcome.command_palette.support.open_support_palette": "Support...",
				"t.welcome.landing_page.sections.hero.learn_more": "Learn More",
				"t.welcome.landing_page.sections.hero.try_now_button": "Try Now",
				"t.welcome.landing_page.sections.hero.sign_up": "Sign Up",
			},
		})

		translate.$.marry(() => {
			const on_email_support = (url: string) => () =>
				commands.emit("cmd.application.router.open_external", { url: `mailto:${url}`, new_tab: true })

			const on_messenger_support = (url: string) => () =>
				commands.emit("cmd.application.router.open_external", { url, new_tab: true })

			const email_support = translate("t.common.urls.support_email")
			const messenger_support = translate("t.common.urls.support_messenger")

			commands.off("cmd.welcome.go_to_messenger_support", on_messenger_support(messenger_support))
			commands.off("cmd.welcome.go_to_email_support", on_email_support(email_support))

			commands.on("cmd.welcome.go_to_messenger_support", on_messenger_support(messenger_support))
			commands.on("cmd.welcome.go_to_email_support", on_email_support(email_support))
		})

		commands.on("cmd.welcome.go_to_welcome_page", () => commands.emit("cmd.application.router.navigate", { url: "/" }))

		commands.emit("cmd.application.command_palette.add", {
			readable_name: "t.welcome.go_to_welcome_page",
			value: () => commands.emit("cmd.welcome.go_to_welcome_page"),
			type: CommandPaletteItemType.PAGE_OPENER,
			hotkey: "mod+shift+h",
			render_icon: BsCollection,
		})

		commands.on("cmd.welcome.open_support_palette", () => {
			commands.emit("cmd.application.command_palette.show", {
				on_select: item => commands.emit(item.value),
				items: [
					{
						readable_name: "t.welcome.command_palette.support.email",
						value: "cmd.welcome.go_to_email_support",
						hotkey: "1",
						render_icon: BsEnvelopeAt,
					},
					{
						readable_name: "t.welcome.command_palette.support.messenger",
						value: "cmd.welcome.go_to_messenger_support",
						hotkey: "2",
						render_icon: BsSendCheck,
					},
				],
			})
		})

		commands.emit("cmd.application.command_palette.add", {
			readable_name: "t.welcome.command_palette.support.open_support_palette",
			value: () => commands.emit("cmd.welcome.open_support_palette"),
			type: CommandPaletteItemType.PAGE_OPENER,
			hotkey: "mod+h", // TODO: Should work with mod+/
			render_icon: BsQuestionOctagon,
		})

		commands.emit("cmd.functions.activities.register", {
			name: "pink.ordo.welcome.landing-page",
			render_workspace: () => WelcomeWorkspace,
			render_icon: BsCollection,
			routes: ["/"],
		})
	},
)
