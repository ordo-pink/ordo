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

import { COMMAND_PALETTE, type ClientSDK, MODAL, client_rrr } from "@ordo-pink/sdk-client"
import { type Maoka, create } from "@ordo-pink/oss-maoka"
import { bs_box_arrow_in_right, bs_box_arrow_right, bs_envelope_at, bs_person_bounding_box } from "@ordo-pink/frontend-icons"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { core } from "@ordo-pink/sdk-core"
import { maoka_styled } from "@ordo-pink/oss-maoka/styled"
import { oath } from "@ordo-pink/oss-oath"

import { authenticating_user$ } from "./user.state"
import { current_user_workspace } from "./me/user-me-workspace.component"
import { other_user_workspace } from "./someone/someone-workspace.component"
import { verify_code_modal } from "./modals/verify-code.component"

import "./user.styles.css"

/**
 * Auth jab is responsible for providing means of signing in and out.
 */
export const create_user_jab: Maoka.Jab = ({ use }) => {
	// use(refresh_session_jab)
	use(client_maoka.jabs.register_translations("en", en_translations))
	use(track_prey_jab)
	use(register_other_user_activity_jab)
}

// --- Internal ---

const COMMAND_PALETTE_JOIN_ID = "auth.join"
const COMMAND_PALETTE_SIGN_OUT_ID = "auth.sign_out"
const COMMAND_PALETTE_GO_TO_ACCOUNT_ID = "auth.go_to_account"

const register_other_user_activity_jab: Maoka.Jab = ({ use }) => {
	const state = use(client_maoka.context.consume)

	const handle_onmount = (n: Maoka.Dom.Node) => {
		state.hunter.shoot("activity.register", {
			id: USER_OTHER_ACTIVITY_ID,
			readable_name: "user_workspace_other_activity_name",
			routes: ["/others/:id_or_handle"],
			render_workspace: div =>
				create.dom.render(div, client_maoka.components.with_state(state, other_user_workspace), n.root.create_id),
		})

		return () => {
			state.hunter.shoot("activity.unregister", USER_OTHER_ACTIVITY_ID)
		}
	}

	use(create.dom.jabs.onmount(handle_onmount))
}

const track_prey_jab: Maoka.Jab = ({ node, use }) => {
	const state = use(client_maoka.context.consume)
	const { auth$, fetch, hosts, hunter } = state
	const t_join = use(client_maoka.jabs.translate$("user_modals_join_title"))

	const on_ok_click = () => {
		const email = authenticating_user$.select("email")

		if (email.length < 5 || email.length > 255)
			return void hunter.shoot("notifications.rrr", client_rrr.einval("user_rrr_invalid_email_length"))
		if (!core.user.email_guard(email))
			return void hunter.shoot("notifications.rrr", client_rrr.einval("user_rrr_invalid_email"))

		oath
			.of(new Headers())
			.pipe(oath.ops.tap(h => h.append("Content-Type", "application/json")))
			.pipe(
				oath.ops.map(headers => ({ headers, method: "POST", body: JSON.stringify([email]), credentials: "include" as const })),
			)
			.pipe(oath.ops.chain(init => oath.from_promise(() => fetch(`${hosts.id}/auth/request-code`, init))))
			.pipe(oath.ops.chain(res => oath.if_else(res.status < 300, { t: () => res })))
			.pipe(oath.ops.tap(() => hunter.shoot("user.show_verify_code_modal")))
			.cata(oath.catas.to_promise())
			.catch(() => void 0)
			.finally(() => hunter.shoot("background_status.none"))
	}

	const [show_join_modal, hide_modal] = use(
		client_maoka.jabs.dialog.actions(state, {
			actions: () => [{ hotkey: "enter", kindergarten: t_join, on_click: on_ok_click }],
			render_body: div => create.dom.render(div, client_maoka.components.with_state(state, email_input), node.root.create_id),
			title: t_join,
		}),
	)

	const handle_mount = () => {
		let release_join = core.fns.v
		let release_verify_code = core.fns.v
		let release_sign_out = core.fns.v
		let release_go_to_account = core.fns.v

		const divorce_user = auth$.cheat("user", user => {
			hunter.shoot("command_palette.remove", COMMAND_PALETTE_JOIN_ID)
			hunter.shoot("command_palette.remove", COMMAND_PALETTE_SIGN_OUT_ID)
			hunter.shoot("command_palette.remove", COMMAND_PALETTE_GO_TO_ACCOUNT_ID)

			release_join()
			release_verify_code()
			release_sign_out()
			release_go_to_account()

			if (user) {
				hide_modal()
				release_go_to_account = hunter.track("user.go_to_account", () => void hunter.shoot("router.set_pathname", "/me"))
				release_sign_out = hunter.track("user.sign_out", () => {
					oath
						.of({ method: "DELETE", credentials: "include" } as const)
						.pipe(oath.ops.and(init => oath.from_promise(() => fetch(`${hosts.id}/auth`, init))))
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

				release_join = core.fns.v
				release_verify_code = core.fns.v

				hunter.shoot("command_palette.add", {
					id: COMMAND_PALETTE_SIGN_OUT_ID,
					readable_name: "user_commands_sign_out_name",
					render_icon: span => create.dom.render(span, bs_box_arrow_right({}), node.root.create_id),
					value: () => hunter.shoot("user.sign_out"),
					description: "user_commands_sign_out_description",
					type: COMMAND_PALETTE.ITEM_TYPE.DESTRUCTIVE_ACTION,
				})

				hunter.shoot("command_palette.add", {
					id: COMMAND_PALETTE_GO_TO_ACCOUNT_ID,
					readable_name: "user_commands_go_to_account_name",
					render_icon: span => create.dom.render(span, bs_person_bounding_box(), node.root.create_id),
					value: () => hunter.shoot("user.go_to_account"),
					description: "user_commands_go_to_account_description",
					type: COMMAND_PALETTE.ITEM_TYPE.PAGE_OPENER,
				})

				hunter.shoot("activity.register", {
					id: USER_CURRENT_ACTIVITY_ID,
					readable_name: "user_workspace_current_activity_name",
					routes: ["/me"],
					render_icon: span => create.dom.render(span, bs_person_bounding_box(), node.root.create_id),
					render_workspace: div => create.dom.render(div, current_user_workspace({ state }), node.root.create_id),
				})
			} else {
				release_join = hunter.track("user.show_request_code_modal", show_join_modal)

				release_verify_code = hunter.track("user.show_verify_code_modal", () => {
					hunter.shoot("modal.show", {
						size: MODAL.SIZE.SM,
						render: div =>
							create.dom.render(div, client_maoka.components.with_state(state, verify_code_modal), node.root.create_id),
					})
				})

				release_go_to_account = core.fns.v
				release_sign_out = core.fns.v

				hunter.shoot("command_palette.add", {
					id: COMMAND_PALETTE_JOIN_ID,
					readable_name: "user_commands_join_name",
					render_icon: span => create.dom.render(span, bs_box_arrow_in_right(), node.root.create_id),
					value: () => {
						hunter.shoot("user.show_request_code_modal")
						hunter.shoot("command_palette.hide")
					},
					description: "user_commands_join_description",
					type: COMMAND_PALETTE.ITEM_TYPE.MODAL_OPENER,
					hotkey: "mod+j",
				})

				hunter.shoot("activity.unregister", USER_CURRENT_ACTIVITY_ID)
			}

			return () => {
				hunter.shoot("command_palette.remove", COMMAND_PALETTE_JOIN_ID)
				hunter.shoot("command_palette.remove", COMMAND_PALETTE_SIGN_OUT_ID)
				hunter.shoot("command_palette.remove", COMMAND_PALETTE_GO_TO_ACCOUNT_ID)
				release_join()
				release_verify_code()
				release_sign_out()
				divorce_user()
			}
		})
	}

	use(create.dom.jabs.onmount(handle_mount))
}

const USER_CURRENT_ACTIVITY_ID = "@ordo-pink/user-current"
const USER_OTHER_ACTIVITY_ID = "@ordo-pink/user-other"

const en_translations: ClientSDK.Translations.PickValues<"user"> = {
	user_commands_go_to_account_description: "Open your account details page.",
	user_commands_go_to_account_name: "Go to Account",
	user_commands_join_description: "Sign up/sign in. Make sure you enter email correcly - we'll send a code there.",
	user_commands_join_name: "Join...",
	user_commands_sign_out_description: "Terminate current session and remove any locally stored files.",
	user_commands_sign_out_name: "Sign out",
	user_common_cancel: "Cancel",
	user_common_edit: "Edit",
	user_common_ok: "OK",
	user_modals_join_hint: "Make sure you enter your email correctly. We'll send you a code that will let you in.",
	user_modals_join_join: "Join",
	user_modals_join_placeholder: "are@you.kidding",
	user_modals_join_title: "Join ORDO",
	user_modals_verify_hint: "We sent you a code to the email you specified. Check your inbox!",
	user_modals_verify_placeholder: "123456",
	user_modals_verify_submit: "Submit",
	user_modals_verify_title: "Enter code",
	user_rrr_invalid_code_length: "Verification code must be exactly 6 digits long",
	user_rrr_invalid_email_length: "Email must be from 5 to 255 characters long.",
	user_rrr_invalid_email: "Provided email is invalid or not supported.",
	user_workspace_current_achievements_message: "🚧 SOON",
	user_workspace_current_achievements_title: "Achievements",
	user_workspace_current_activity_name: "Account",
	user_workspace_current_danger_zone_hint: "WARNING: These actions are IRREVERSIBLE!",
	user_workspace_current_danger_zone_remove_account: "Remove account",
	user_workspace_current_danger_zone_remove_content: "Remove content",
	user_workspace_current_danger_zone_rrr_message: "This is not implemented yet 🥲",
	user_workspace_current_danger_zone_rrr_title: "Sorry",
	user_workspace_current_danger_zone_title: "DANGER ZONE",
	user_workspace_current_sessions_modal_hint:
		"This action is irreversible. Someone will be kicked out of the account. Lucky if it was you!",
	user_workspace_current_sessions_modal_notification_message: "This is not implemented yet 🥲",
	user_workspace_current_sessions_modal_notification_title: "Sorry",
	user_workspace_current_sessions_modal_title: "Revoke session",
	user_workspace_current_sessions_remove: "Remove session",
	user_workspace_current_sessions_title: "Sessions",
	user_workspace_current_settings_message: "🚧 SOON",
	user_workspace_current_settings_title: "Settings",
	user_workspace_current_two_factor_auth_message: "🚧 SOON",
	user_workspace_current_two_factor_auth_title: "MFA",
	user_workspace_current_user_info_email: "Email",
	user_workspace_current_user_info_handle: "Handle",
	user_workspace_current_user_info_name: "Public Name",
	user_workspace_current_user_info_title: "User Info",
	user_workspace_other_activity_name: "User Info",
}

const email_input = create.create("label", ({ use }) => {
	use(client_maoka.jabs.classes.set("user_join-modal_email_wrapper"))
	return () => [bs_envelope_at({}), search()]
})

const search = maoka_styled.tags.input("user_join-modal_email", ({ use }) => {
	const t_placeholder = use(client_maoka.jabs.translate$("user_modals_join_placeholder"))
	const value = authenticating_user$.select("email")

	const handle_mount = () => use(create.dom.jabs.hit_if_dom(n => n.value.focus()))
	const handle_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		authenticating_user$.update("email", () => target.value)
	}
	use(client_maoka.jabs.set_id("email-input"))
	use(client_maoka.jabs.set_attribute("type", "email"))
	use(client_maoka.jabs.set_attribute("placeholder", t_placeholder()))
	use(client_maoka.jabs.listen("oninput", handle_input))
	use(create.dom.jabs.onmount(handle_mount))
	if (value) use(client_maoka.jabs.set_attribute("value", value))
})
