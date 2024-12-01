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

import { BsCollection, BsEnvelopeAt, BsQuestionOctagon, BsSendCheck } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { create_function } from "@ordo-pink/core"

import { WelcomeWorkspace } from "./src/welcome.workspace"

declare global {
	interface t {
		welcome: {
			go_to_welcome_page: () => string
			command_palette: {
				support: {
					open_support_palette: () => string
					email: () => string
					messenger: () => string
				}
			}
			start_page: {
				title: () => string
				news_widget: {
					title: () => string
				}
			}
			landing_page: {
				title: () => string
				cookie_banner: {
					title: () => string
					message: () => string
				}
				rrr_sign_up_unavailable: {
					title: () => string
					message: () => string
				}
				sections: {
					hero: {
						beta_started_announcement: () => string
						learn_more: () => string
						try_now_button: () => string
						sign_up: () => string
					}
				}
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
			"data.metadata_query",
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
			"cmd.application.notification.show",
			"cmd.application.router.navigate",
			"cmd.application.router.open_external",
			"cmd.application.set_title",
			"cmd.auth.open_sign_in",
			"cmd.auth.open_sign_up",
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
	ctx => {
		const { on, off, emit } = ctx.get_commands()

		emit("cmd.application.add_translations", {
			lang: "en",
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
				"t.welcome.landing_page.rrr_sign_up_unavailable.message":
					"Signing up is not available right now. You can use ORDO without credentials, tho!",
				"t.welcome.landing_page.rrr_sign_up_unavailable.title": "Wrong button!",
			},
		})

		ctx.translate.$.subscribe(() => {
			const on_email_support = (url: string) => () =>
				emit("cmd.application.router.open_external", {
					url: `mailto:${url}`,
					new_tab: true,
				})

			const on_messenger_support = (url: string) => () => emit("cmd.application.router.open_external", { url, new_tab: true })

			const email_support = ctx.translate("t.common.urls.support_email")
			const messenger_support = ctx.translate("t.common.urls.support_messenger")

			off("cmd.welcome.go_to_messenger_support", on_messenger_support(messenger_support))
			off("cmd.welcome.go_to_email_support", on_email_support(email_support))

			on("cmd.welcome.go_to_messenger_support", on_messenger_support(messenger_support))
			on("cmd.welcome.go_to_email_support", on_email_support(email_support))
		})

		on("cmd.welcome.go_to_welcome_page", () => emit("cmd.application.router.navigate", "/"))

		emit("cmd.application.command_palette.add", {
			readable_name: "t.welcome.go_to_welcome_page",
			on_select: () => emit("cmd.welcome.go_to_welcome_page"),
			hotkey: "mod+shift+h",
			render_icon: div => void div.appendChild(BsCollection() as SVGSVGElement),
		})

		on("cmd.welcome.open_support_palette", () => {
			emit("cmd.application.command_palette.show", {
				items: [
					{
						readable_name: "t.welcome.command_palette.support.email",
						on_select: () => emit("cmd.welcome.go_to_email_support"),
						hotkey: "1",
						render_icon: div => void div.appendChild(BsEnvelopeAt() as SVGSVGElement),
					},
					{
						readable_name: "t.welcome.command_palette.support.messenger",
						on_select: () => emit("cmd.welcome.go_to_messenger_support"),
						hotkey: "2",
						render_icon: div => void div.appendChild(BsSendCheck() as SVGSVGElement),
					},
				],
			})
		})

		emit("cmd.application.command_palette.add", {
			readable_name: "t.welcome.command_palette.support.open_support_palette",
			on_select: () => emit("cmd.welcome.open_support_palette"),
			hotkey: "mod+h", // TODO: Should work with mod+/
			render_icon: div => void div.appendChild(BsQuestionOctagon() as SVGSVGElement),
		})

		emit("cmd.functions.activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.welcome.landing-page",
				render_workspace: div => Maoka.render_dom(div, WelcomeWorkspace(ctx)),
				render_icon: span => void span.appendChild(BsCollection() as SVGSVGElement),
				routes: ["/"],
			},
		})
	},
)
