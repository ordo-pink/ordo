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
	interface t {
		welcome: {
			authenticated_page_title: () => string
			beta_started_announcement: () => string
			cookies_warning: () => string
			news_widget_title: () => string
			unauthenticated_page_title: () => string
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
			"application.hosts",
			"users.current_user.is_authenticated",
			"application.fetch",
		],
		commands: [
			"cmd.application.set_title",
			"cmd.functions.activities.register",
			"cmd.auth.open_sign_in",
			"cmd.auth.open_sign_up",
			"cmd.application.add_translations",
			"cmd.application.router.navigate",
			"cmd.application.router.open_external",
			"cmd.application.background_task.start_loading",
			"cmd.application.background_task.reset_status",
			"cmd.application.modal.show",
			"cmd.application.modal.hide",
		],
	},
	ctx => {
		const Provider = create_ordo_context()
		const commands = ctx.get_commands()
		const translations$ = ctx.get_translations()
		const current_language = TwoLetterLocale.ENGLISH // TODO: Move locale management to main -> user settings

		translations$.subscribe(option => {
			const on_messenger_support = (url: string) => () => {
				commands.emit("cmd.application.router.open_external", {
					url,
					new_tab: true,
				})
			}

			const on_email_support = (url: string) => () => {
				{
					commands.emit("cmd.application.router.open_external", {
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
						commands.off(
							"cmd.welcome.go_to_messenger_support",
							on_messenger_support(messenger_support),
						)

						commands.off("cmd.welcome.go_to_email_support", on_email_support(email_support))

						commands.on(
							"cmd.welcome.go_to_messenger_support",
							on_messenger_support(messenger_support),
						)

						commands.on("cmd.welcome.go_to_email_support", on_email_support(email_support))
					},
				})
		})

		let workspace_root_option: TOption<Root>

		commands.on("cmd.welcome.go_to_welcome_page", () =>
			commands.emit("cmd.application.router.navigate", "/"),
		)

		commands.emit("cmd.application.add_translations", {
			lang: "en",
			prefix: "welcome",
			translations: EN_TRANSLATIONS,
		})

		commands.emit("cmd.functions.activities.register", {
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

const EN_TRANSLATIONS: TScopedTranslations<"welcome"> = {
	authenticated_page_title: "Welcome back!",
	beta_started_announcement: "public beta is live!",
	cookies_warning: "We don't use cookies! Wait, what?",
	news_widget_title: "News",
	unauthenticated_page_title: "One space for docs, files and projects",
}
