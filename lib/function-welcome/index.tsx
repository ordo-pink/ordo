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

import { type Root, createRoot } from "react-dom/client"
import { BsCollection } from "react-icons/bs"

import { O, type TOption } from "@ordo-pink/option"
import { Result } from "@ordo-pink/result"
import { TwoLetterLocale } from "@ordo-pink/locale"
import { create_function } from "@ordo-pink/core"
import { create_ordo_context } from "@ordo-pink/frontend-react-hooks/src/use-ordo-context.hook"
import { noop } from "@ordo-pink/tau"

import LandingWorkspace from "./views/landing.workspace"

declare global {
	module cmd {
		module welcome {
			type to_welcome_page = { name: "welcome.to_welcome_page" }
			type messenger_support = { name: "welcome.messenger_support" }
			type email_support = { name: "welcome.email_support" }
			type open_support = { name: "welcome.open_support" }
		}
	}
}

export default create_function(
	"pink.ordo.welcome",
	{
		queries: [
			"application.commands",
			"application.hosts",
			"users.current_user.is_authenticated",
			"application.fetch",
		],
		commands: [
			"application.set_title",
			"activities.register",
			"auth.open_sign_up",
			"auth.open_sign_in",
			"application.add_translations",
			"router.navigate",
			"router.open_external",
			"application.background_task.start_loading",
			"application.background_task.reset_status",
			"modal.show",
			"modal.hide",
		],
	},
	ctx => {
		const Provider = create_ordo_context()
		const commands = ctx.get_commands()
		const translations$ = ctx.get_translations()
		const current_language = TwoLetterLocale.ENGLISH // TODO: Move locale management to main -> user settings

		translations$.subscribe(option => {
			const on_messenger_support = (url: string) => () => {
				commands.emit<cmd.router.open_external>("router.open_external", {
					url,
					new_tab: true,
				})
			}

			const on_email_support = (url: string) => () => {
				{
					commands.emit<cmd.router.open_external>("router.open_external", {
						url,
						new_tab: true,
					})
				}
			}

			Result.FromOption(option)
				.pipe(Result.ops.chain(ts => Result.FromNullable(ts[current_language])))
				.pipe(
					Result.ops.chain(ts =>
						Result.Merge({
							messenger_support: Result.FromNullable(ts["common.messenger_support_url"]),
							email_support: Result.FromNullable(ts["common.email_support"]),
						}),
					),
				)
				.cata({
					Err: noop,
					Ok: ({ messenger_support, email_support }) => {
						commands.off<cmd.welcome.messenger_support>(
							"welcome.messenger_support",
							on_messenger_support(messenger_support),
						)

						commands.off<cmd.welcome.email_support>(
							"welcome.email_support",
							on_email_support(email_support),
						)

						commands.on<cmd.welcome.messenger_support>(
							"welcome.messenger_support",
							on_messenger_support(messenger_support),
						)

						commands.on<cmd.welcome.email_support>(
							"welcome.email_support",
							on_email_support(email_support),
						)
					},
				})
		})

		let workspace_root_option: TOption<Root>

		commands.on<cmd.welcome.to_welcome_page>("welcome.to_welcome_page", () =>
			commands.emit<cmd.router.navigate>("router.navigate", "/"),
		)

		commands.emit<cmd.application.add_translations>("application.add_translations", {
			lang: "en",
			prefix: "pink.ordo.welcome",
			translations: EN_TRANSLATIONS,
		})

		commands.emit<cmd.activities.register>("activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.welcome.landing-page",
				render_workspace: div => {
					workspace_root_option = O.Some(createRoot(div))
					workspace_root_option.unwrap()!.render(
						<Provider value={ctx}>
							<LandingWorkspace />
						</Provider>,
					)
				},
				render_icon: span => {
					createRoot(span).render(<BsCollection />)
				},
				routes: ["/"],
				on_unmount: () => {
					workspace_root_option.pipe(O.ops.map(root => root.unmount()))
				},
			},
		})
	},
)

const EN_TRANSLATIONS: Record<string, string> = {
	beta_started_announcement: "public beta is live!",
	cookies_warning: "We don't use cookies! Wait, what?",
	title: "One space for docs, files and projects",
	auth_title: "Welcome back!",
	news_widget_title: "News",
}
