/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { COMMAND_PALETTE, MODAL } from "@ordo-pink/sdk-client"
import { Maoka, maoka_dom } from "@ordo-pink/maoka"
import { bs_box_arrow_in_right, bs_box_arrow_right } from "@ordo-pink/frontend-icons"
import { get_device_info } from "@ordo-pink/get-device-info"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"
import { user } from "@ordo-pink/sdk-core"

import { auth$ } from "./auth.state"
import { join_modal } from "./components/join.component"
import { verify_code_modal } from "./components/verify-code.component"

import "./auth.styles.css"

/**
 * Auth jab is responsible for providing means of signing in and out.
 */
export const auth_jab: Maoka.Jab = ({ use }) => {
	use(refresh_session_jab)
	use(track_prey_jab)
	use(register_translations_jab)
}

// --- Internal ---

const COMMAND_PALETTE_JOIN_ID = "auth.join"
const COMMAND_PALETTE_SIGN_OUT_ID = "auth.sign_out"

const register_translations_jab: Maoka.Jab = ({ use }) => {
	const { hunter } = use(maoka_sdk.context.consume)

	hunter.shoot("i18n.add_translations", {
		locale: "en",
		values: {
			auth_commands_join_description: "Sign up/sign in. Make sure you enter email correcly - we'll send a code there.",
			auth_commands_join_name: "Join...",
			auth_commands_sign_out_description: "Terminate current session and remove any locally stored files.",
			auth_commands_sign_out_name: "Sign out",
			auth_common_cancel: "Cancel",
			auth_modals_join_hint: "Make sure you enter your email correctly. We'll send you a code that will let you in.",
			auth_modals_join_join: "Join",
			auth_modals_join_title: "Join ORDO",
			auth_modals_verify_hint: "We sent you a code to the email you specified. Check your inbox!",
			auth_modals_verify_submit: "Submit",
			auth_modals_verify_title: "Enter code",
		},
	})
}

const refresh_session_jab: Maoka.Jab = ({ use }) => {
	const { fetch, hosts, hunter } = use(maoka_sdk.context.consume)

	const handle_mount = () => {
		const refresh_session0 = oath
			.of(new Headers())
			.pipe(oath.ops.tap(h => h.append("X-Device", get_device_info(navigator))))
			.pipe(oath.ops.map(headers => ({ headers, method: "POST", credentials: "include" }) as const))
			.pipe(
				oath.ops.chain(init =>
					oath.from_promise(() =>
						fetch(`${hosts.id}/session`, init).then(res => (res.status < 300 ? res.json() : Promise.reject())),
					),
				),
			)
			.pipe(oath.ops.map(dto => user.current.from_dto(...dto)))
			.pipe(oath.ops.tap(user => auth$.update("user", () => user)))

		// TODO Sign out on error, show notification
		refresh_session0
			.cata(oath.catas.to_promise())
			.catch(noop)
			.finally(() => hunter.shoot("background_status.none"))

		return () => {
			refresh_session0.cancel("Root component refreshed")
		}
	}

	use(maoka_dom.jabs.onmount(handle_mount))
}

const track_prey_jab: Maoka.Jab = ({ node, use }) => {
	const state = use(maoka_sdk.context.consume)
	const { hosts, hunter } = state

	const handle_mount = () => {
		let release_join = noop
		let release_verify_code = noop
		let release_sign_out = noop

		const divorce_user = auth$.cheat("user", user => {
			hunter.shoot("command_palette.remove", COMMAND_PALETTE_JOIN_ID)
			hunter.shoot("command_palette.remove", COMMAND_PALETTE_SIGN_OUT_ID)

			release_join()
			release_verify_code()
			release_sign_out()

			if (user) {
				release_sign_out = hunter.track("auth.sign_out", () => {
					oath
						.of({ method: "DELETE", credentials: "include" } as const)
						.pipe(oath.ops.and(init => oath.from_promise(() => fetch(`${hosts.id}/session`, init))))
						// TODO Clean up with local persistence strategy
						.pipe(
							oath.ops.tap(() => {
								const history_length = history.length
								history.go(-history_length)
								window.location.replace("/")
							}),
						)
						.cata(oath.catas.to_promise())
						.catch(console.error)
						.finally(() => hunter.shoot("background_status.none"))
				})

				release_join = noop
				release_verify_code = noop

				hunter.shoot("command_palette.add", {
					id: COMMAND_PALETTE_SIGN_OUT_ID,
					readable_name: "auth_commands_sign_out_name",
					render_icon: span => maoka_dom.render(span, bs_box_arrow_right({}), node.root.create_id),
					value: () => hunter.shoot("auth.sign_out"),
					description: "auth_commands_sign_out_description",
					type: COMMAND_PALETTE.ITEM_TYPE.DESTRUCTIVE_ACTION,
				})
			} else {
				release_join = hunter.track("auth.show_request_code_modal", () => {
					hunter.shoot("modal.show", {
						size: MODAL.SIZE.SM,
						render: div => maoka_dom.render(div, maoka_sdk.components.with_state(state, join_modal), node.root.create_id),
					})
				})

				release_verify_code = hunter.track("auth.show_verify_code_modal", () => {
					hunter.shoot("modal.show", {
						size: MODAL.SIZE.SM,
						render: div =>
							maoka_dom.render(div, maoka_sdk.components.with_state(state, verify_code_modal), node.root.create_id),
					})
				})

				release_sign_out = noop

				hunter.shoot("command_palette.add", {
					id: COMMAND_PALETTE_JOIN_ID,
					readable_name: "auth_commands_join_name",
					render_icon: span => maoka_dom.render(span, bs_box_arrow_in_right({}), node.root.create_id),
					value: () => {
						hunter.shoot("auth.show_request_code_modal")
						hunter.shoot("command_palette.hide")
					},
					description: "auth_commands_join_description",
					type: COMMAND_PALETTE.ITEM_TYPE.MODAL_OPENER,
					hotkey: "mod+j",
				})
			}

			return () => {
				hunter.shoot("command_palette.remove", COMMAND_PALETTE_JOIN_ID)
				hunter.shoot("command_palette.remove", COMMAND_PALETTE_SIGN_OUT_ID)
				release_join()
				release_verify_code()
				release_sign_out()
				divorce_user()
			}
		})
	}

	use(maoka_dom.jabs.onmount(handle_mount))
}
