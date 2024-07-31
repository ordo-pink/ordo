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

import { O, type TOption } from "@ordo-pink/option"
import { type TUnwrapOk } from "@ordo-pink/result"
import { create_function } from "@ordo-pink/core"
import { create_ordo_context } from "@ordo-pink/frontend-react-hooks"

import Auth from "./views/auth.workspace"

declare global {
	module t {
		type auth = i18n.TWrapKeys<TAuthTranslationKey, "pink.ordo.auth">
	}

	interface cmd {
		auth: {
			open_sign_in: () => void
			open_sign_up: () => void
			sign_out: () => void
		}
	}
}

const AUTH_KEYS = [
	"sign_up_title",
	"sign_up_hint",
	"sign_in_title",
	"sign_in_hint",
	"email_placeholder",
	"handle_placeholder",
	"already_signed_up",
	"privacy_policy_confirm_lbl",
	"password_has_capital",
	"password_has_digit",
	"password_length_valid",
	"passwords_match",
	"password_has_special_char",
	"handle_is_valid",
	"email_is_valid",
] as const

export type TAuthTranslationKey = (typeof AUTH_KEYS)[number]

const EN_TRANSLATIONS: Record<TAuthTranslationKey, string> = {
	already_signed_up: "Already signed up?",
	email_is_valid: "Email is valid",
	email_placeholder: "hey@ordo.pink",
	handle_is_valid: "Handle is valid",
	handle_placeholder: "armstrong",
	password_has_capital: "Password contains a capital letter",
	password_has_digit: "Password contains a digit",
	password_has_special_char: "Password contains a special char",
	password_length_valid: "Password is 8 to 50 chars long",
	passwords_match: "Passwords match",
	privacy_policy_confirm_lbl: "I agree to ",
	sign_in_hint: "",
	sign_in_title: "Sign In",
	sign_up_hint: "",
	sign_up_title: "Sign Up",
}

export default create_function(
	"pink.ordo.auth",
	{
		queries: [
			"users.current_user.is_authenticated",
			"application.commands",
			"application.current_route",
			"application.hosts",
			"application.fetch",
		],
		commands: [
			"cmd.application.set_title",
			"cmd.functions.activities.register",
			"cmd.functions.activities.unregister",
			"cmd.auth.open_sign_in",
			"cmd.auth.open_sign_up",
			"cmd.application.router.navigate",
			"cmd.application.add_translations",
		],
	},
	ctx => {
		const Provider = create_ordo_context()
		const commands = ctx.get_commands()
		const fetch = ctx.get_fetch()
		const hosts_result = ctx.get_hosts()
		const hosts = hosts_result.unwrap() as TUnwrapOk<typeof hosts_result>

		let workspace_root_option: TOption<Root> = O.None()

		commands.on("cmd.auth.open_sign_in", () =>
			commands.emit("cmd.application.router.navigate", "/auth/sign-in"),
		)

		commands.on("cmd.auth.open_sign_up", () =>
			commands.emit("cmd.application.router.navigate", "/auth/sign-up"),
		)

		commands.on("cmd.auth.sign_out", () => {
			const path: Routes.ID.SignOut.Path = "/account/sign-out"
			const method: Routes.ID.SignOut.Method = "POST"
			const credentials = "include"
			const url = hosts.id.concat(path)

			void fetch(url, { method, credentials }).then(() => {
				window.history.replaceState(null, "")
				window.location.replace("/")
			})
		})

		commands.emit("cmd.application.add_translations", {
			lang: "en",
			translations: EN_TRANSLATIONS,
			prefix: "pink.ordo.auth",
		})

		commands.emit("cmd.functions.activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.auth.authentication",
				routes: ["/auth/:action"],
				default_route: "/auth/sign-in",
				is_background: false,
				is_fullscreen: false,
				render_workspace: div => {
					workspace_root_option = O.Some(createRoot(div))
					workspace_root_option.unwrap()!.render(
						<Provider value={ctx}>
							<Auth />
						</Provider>,
					)
				},
				on_unmount: () => {
					workspace_root_option.pipe(O.ops.map(root => root.unmount()))
				},
			},
		})
	},
)
