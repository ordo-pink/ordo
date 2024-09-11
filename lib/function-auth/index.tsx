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

import {
	BsAward,
	BsBoxArrowInDown,
	BsBoxArrowInRight,
	BsBoxArrowUp,
	BsGear,
	BsPersonCircle,
} from "react-icons/bs"
import { type Root, createRoot } from "react-dom/client"

import { O, type TOption } from "@ordo-pink/option"
import { type TUnwrapOk } from "@ordo-pink/result"
import { create_function } from "@ordo-pink/core"
import { create_ordo_context } from "@ordo-pink/frontend-react-hooks"

import Auth from "./views/auth.workspace"

declare global {
	interface t {
		auth: {
			inputs: {
				email: {
					label: () => string
					placeholder: () => string
					is_valid: () => string
				}
				handle: {
					label: () => string
					placeholder: () => string
					is_valid: () => string
				}
				password: {
					label: () => string
					placeholder: () => string
					repeat_password_label: () => string
					has_capital_letter: () => string
					has_digit: () => string
					length_valid: () => string
					passwords_match: () => string
					has_special_char: () => string
				}
			}
			errors: {
				sign_in: {
					enoent: () => string
					eio: () => string
					einval: () => string
				}
				sign_up: {
					eexist: () => string
					eio: () => string
					einval: () => string
				}
				unexpected_error: () => string
			}
			legal: {
				privacy_policy: {
					label: () => string
					consent: () => string
				}
				license: {
					label: () => string
				}
			}
			pages: {
				sign_in: {
					status_bar_title: () => string
					label: () => string
					not_signed_up: () => string
				}
				sign_up: {
					status_bar_title: () => string
					label: () => string
					already_signed_up: () => string
				}
				sign_out: {
					label: () => string
				}
			}
			user: {
				open_current_user_profile: () => string
				open_settings: () => string
				open_achievements: () => string
			}
		}
	}

	interface cmd {
		auth: {
			open_sign_in: () => void
			open_sign_up: () => void
			sign_out: () => void
		}
	}
}

const AUTH_KEYS = [] as const

export type TAuthTranslationKey = (typeof AUTH_KEYS)[number]

// TODO: Lazy translations installation
const EN_TRANSLATIONS: TScopedTranslations<"auth"> = {
	"errors.sign_in.einval": "Provided input is invalid",
	"errors.sign_in.eio": "Error connecting to the server",
	"errors.sign_in.enoent": "User with provided credentials does not exist",
	"errors.sign_up.eexist": "User with this email or handle already exists",
	"errors.sign_up.einval": "Provided inputs are invalid",
	"errors.sign_up.eio": "Error connecting to the server",
	"errors.unexpected_error": "Unexpected error",
	"inputs.email.is_valid": "Email is valid",
	"inputs.email.label": "Email",
	"inputs.email.placeholder": "hey@ordo.pink",
	"inputs.handle.is_valid": "Handle is valid",
	"inputs.handle.label": "Handle",
	"inputs.handle.placeholder": "armstrong",
	"inputs.password.has_capital_letter": "Password contains a capital letter",
	"inputs.password.has_digit": "Password contains a digit",
	"inputs.password.has_special_char": "Password contains a special char",
	"inputs.password.label": "Password",
	"inputs.password.length_valid": "Password is 8 to 50 chars long",
	"inputs.password.passwords_match": "Passwords match",
	"inputs.password.placeholder": "*********",
	"inputs.password.repeat_password_label": "Repeat password",
	"legal.license.label": "License",
	"legal.privacy_policy.consent": "I agree to ",
	"legal.privacy_policy.label": "Privacy Policy",
	"pages.sign_in.label": "Sign In",
	"pages.sign_in.not_signed_up": "Not a member?",
	"pages.sign_in.status_bar_title": "",
	"pages.sign_out.label": "Sign Out",
	"pages.sign_up.already_signed_up": "Already signed up?",
	"pages.sign_up.label": "Sign Up",
	"pages.sign_up.status_bar_title": "",
	"user.open_current_user_profile": "Open user page",
	"user.open_achievements": "Open achievements",
	"user.open_settings": "Open settings",
}

// TODO: Move to core
export default create_function(
	"pink.ordo.auth",
	{
		queries: [
			"application.commands",
			"application.current_route",
			"application.fetch",
			"application.hosts",
			"users.current_user.is_authenticated",
		],
		commands: [
			"cmd.application.add_translations",
			"cmd.application.command_palette.add",
			"cmd.application.command_palette.remove",
			"cmd.application.notification.show",
			"cmd.application.router.navigate",
			"cmd.application.set_title",
			"cmd.auth.open_sign_in",
			"cmd.auth.open_sign_up",
			"cmd.auth.sign_out",
			"cmd.functions.activities.register",
			"cmd.functions.activities.unregister",
			"cmd.user.open_achievements",
			"cmd.user.open_current_user_profile",
			"cmd.user.open_settings",
		],
	},
	ctx => {
		const Provider = create_ordo_context()
		const commands = ctx.get_commands()
		const fetch = ctx.get_fetch()
		const hosts_result = ctx.get_hosts()
		const hosts = hosts_result.unwrap() as TUnwrapOk<typeof hosts_result>

		const auth_result = ctx.get_is_authenticated()
		const auth$ = auth_result.unwrap() as TUnwrapOk<typeof auth_result>

		auth$.subscribe(is_authenticated => {
			const on_open_sign_in = () =>
				commands.emit("cmd.application.router.navigate", "/auth/sign-in")
			const on_open_sign_up = () =>
				commands.emit("cmd.application.router.navigate", "/auth/sign-up")
			const on_open_user_profile = () => commands.emit("cmd.application.router.navigate", "/user")
			const on_open_achievements = () =>
				commands.emit("cmd.application.router.navigate", "/user/achievements")
			const on_open_settings = () =>
				commands.emit("cmd.application.router.navigate", "/user/settings")

			const on_sign_out = () => {
				const path: Routes.ID.SignOut.Path = "/account/sign-out"
				const method: Routes.ID.SignOut.Method = "POST"
				const credentials = "include"
				const url = hosts.id.concat(path)

				void fetch(url, { method, credentials }).then(() => window.location.replace("/"))
			}

			if (is_authenticated) {
				commands.off("cmd.auth.open_sign_in", on_open_sign_in)
				commands.off("cmd.auth.open_sign_up", on_open_sign_up)
				commands.emit("cmd.application.command_palette.remove", "cmd.auth.open_sign_in")
				commands.emit("cmd.application.command_palette.remove", "cmd.auth.open_sign_up")

				commands.on("cmd.auth.sign_out", on_sign_out)
				commands.on("cmd.user.open_current_user_profile", on_open_user_profile)
				commands.on("cmd.user.open_achievements", on_open_achievements)
				commands.on("cmd.user.open_settings", on_open_settings)

				commands.emit("cmd.application.command_palette.add", {
					id: "cmd.auth.sign_out",
					readable_name: "t.auth.pages.sign_out.label",
					Icon: BsBoxArrowInDown,
					on_select: () => commands.emit("cmd.auth.sign_out"),
				})

				commands.emit("cmd.application.command_palette.add", {
					id: "cmd.user.open_current_user_profile",
					readable_name: "t.auth.user.open_current_user_profile",
					Icon: BsPersonCircle,
					on_select: () => commands.emit("cmd.user.open_current_user_profile"),
				})

				commands.emit("cmd.application.command_palette.add", {
					id: "cmd.user.open_settings",
					readable_name: "t.auth.user.open_settings",
					Icon: BsGear,
					on_select: () => commands.emit("cmd.user.open_settings"),
					accelerator: "mod+,", // TODO: Fix using symbols
				})

				commands.emit("cmd.application.command_palette.add", {
					id: "cmd.user.open_achievements",
					readable_name: "t.auth.user.open_achievements",
					Icon: BsAward,
					on_select: () => commands.emit("cmd.user.open_achievements"),
					accelerator: "mod+y",
				})
			} else {
				commands.off("cmd.auth.sign_out", on_sign_out)
				commands.off("cmd.user.open_achievements", on_open_achievements)
				commands.off("cmd.user.open_current_user_profile", on_open_user_profile)
				commands.off("cmd.user.open_settings", on_open_settings)
				commands.emit("cmd.application.command_palette.remove", "cmd.auth.sign_out")
				commands.emit("cmd.application.command_palette.remove", "cmd.user.open_achievements")
				commands.emit(
					"cmd.application.command_palette.remove",
					"cmd.user.open_current_user_profile",
				)
				commands.emit("cmd.application.command_palette.remove", "cmd.user.open_settings")

				commands.on("cmd.auth.open_sign_in", on_open_sign_in)
				commands.on("cmd.auth.open_sign_up", on_open_sign_up)

				commands.emit("cmd.application.command_palette.add", {
					id: "cmd.auth.open_sign_in",
					readable_name: "t.auth.pages.sign_in.label",
					Icon: BsBoxArrowInRight,
					on_select: () => commands.emit("cmd.auth.open_sign_in"),
					accelerator: "mod+shift+l",
				})

				commands.emit("cmd.application.command_palette.add", {
					id: "cmd.auth.open_sign_up",
					readable_name: "t.auth.pages.sign_up.label",
					Icon: BsBoxArrowUp,
					on_select: () => commands.emit("cmd.auth.open_sign_up"),
					accelerator: "mod+shift+r",
				})
			}
		})

		let workspace_root_option: TOption<Root> = O.None()

		commands.emit("cmd.application.add_translations", {
			lang: "en",
			prefix: "auth",
			translations: EN_TRANSLATIONS,
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
