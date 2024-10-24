// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// import { BsCollection, BsEnvelope, BsQuestionOctagon, BsSendCheck } from "react-icons/bs"

import { BS_COLLECTION } from "@ordo-pink/frontend-icons"
import { create_function } from "@ordo-pink/core"

import { Maoka } from "@ordo-pink/maoka"
import { WelcomeWorkspace } from "./src/welcome.workspace"

declare global {
	interface t {
		welcome: {
			authenticated_page_title: () => string
			beta_started_announcement: () => string
			cookies_warning: () => string
			news_widget_title: () => string
			unauthenticated_page_title: () => string
			command_palette: {
				support: {
					open_support_palette: () => string
					email: () => string
					messenger: () => string
				}
				go_to_welcome_page: () => string
			}
		}
	}

	interface cmd {
		welcome: {
			go_to_email_support: () => void
			go_to_messenger_support: () => void
			go_to_welcome_page: () => void
			open_support_palette: () => void
		}
	}
}

export default create_function(
	"pink.ordo.welcome",
	{
		queries: [
			"application.commands",
			"application.current_language",
			"application.fetch",
			"application.hosts",
			"users.current_user.is_authenticated",
		],
		commands: [
			"cmd.application.add_translations",
			"cmd.application.background_task.reset_status",
			"cmd.application.background_task.start_loading",
			"cmd.application.command_palette.add",
			"cmd.application.command_palette.hide",
			"cmd.application.command_palette.show",
			"cmd.application.modal.hide",
			"cmd.application.modal.show",
			"cmd.application.router.navigate",
			"cmd.application.router.open_external",
			"cmd.application.set_title",
			"cmd.auth.open_sign_in",
			"cmd.auth.open_sign_up",
			"cmd.functions.activities.register",
			"cmd.welcome.open_support_palette",
			"cmd.welcome.go_to_welcome_page",
			"cmd.welcome.go_to_email_support",
			"cmd.welcome.go_to_messenger_support",
		],
	},
	ctx => {
		const commands = ctx.get_commands()

		commands.emit("cmd.application.add_translations", {
			lang: "en",
			translations: {
				"t.welcome.authenticated_page_title": "Welcome back!",
				"t.welcome.beta_started_announcement": "public beta is live!",
				"t.welcome.cookies_warning": "We don't use cookies! Wait, what?",
				"t.welcome.news_widget_title": "News",
				"t.welcome.unauthenticated_page_title": "One space for docs, files and projects",
				"t.welcome.command_palette.go_to_welcome_page": "Go to homepage",
				"t.welcome.command_palette.support.email": "Contact via email",
				"t.welcome.command_palette.support.messenger": "Contact via messenger",
				"t.welcome.command_palette.support.open_support_palette": "Support...",
			},
		})

		ctx.translate.$.subscribe(() => {
			const on_email_support = (url: string) => () =>
				commands.emit("cmd.application.router.open_external", {
					url: `mailto:${url}`,
					new_tab: true,
				})
			const on_messenger_support = (url: string) => () =>
				commands.emit("cmd.application.router.open_external", { url, new_tab: true })

			const email_support = ctx.translate("t.common.urls.support_email")
			const messenger_support = ctx.translate("t.common.urls.support_messenger")

			commands.off("cmd.welcome.go_to_messenger_support", on_messenger_support(messenger_support))
			commands.off("cmd.welcome.go_to_email_support", on_email_support(email_support))

			commands.on("cmd.welcome.go_to_messenger_support", on_messenger_support(messenger_support))
			commands.on("cmd.welcome.go_to_email_support", on_email_support(email_support))
		})

		commands.on("cmd.welcome.go_to_welcome_page", () =>
			commands.emit("cmd.application.router.navigate", "/"),
		)

		// commands.emit("cmd.application.command_palette.add", {
		// 	readable_name: "t.welcome.command_palette.go_to_welcome_page",
		// 	on_select: () => commands.emit("cmd.welcome.go_to_welcome_page"),
		// 	accelerator: "mod+shift+h",
		// 	Icon: BsCollection,
		// })

		// commands.on("cmd.welcome.open_support_palette", () => {
		// 	commands.emit("cmd.application.command_palette.show", {
		// 		items: [
		// 			{
		// 				readable_name: "t.welcome.command_palette.support.email",
		// 				on_select: () => commands.emit("cmd.welcome.go_to_email_support"),
		// 				accelerator: "1",
		// 				Icon: BsEnvelope,
		// 			},
		// 			{
		// 				readable_name: "t.welcome.command_palette.support.messenger",
		// 				on_select: () => commands.emit("cmd.welcome.go_to_messenger_support"),
		// 				accelerator: "2",
		// 				Icon: BsSendCheck,
		// 			},
		// 		],
		// 	})
		// })

		// commands.emit("cmd.application.command_palette.add", {
		// 	readable_name: "t.welcome.command_palette.support.open_support_palette",
		// 	on_select: () => commands.emit("cmd.welcome.open_support_palette"),
		// 	accelerator: "mod+h", // TODO: Should work with mod+/
		// 	Icon: BsQuestionOctagon,
		// 	shows_next_palette: true,
		// })

		commands.emit("cmd.functions.activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.welcome.landing-page",
				render_workspace: div => Maoka.render_dom(div, WelcomeWorkspace(ctx)),
				render_icon: span => {
					span.innerHTML = BS_COLLECTION
					return Promise.resolve()
				},
				routes: ["/"],
			},
		})
	},
)
