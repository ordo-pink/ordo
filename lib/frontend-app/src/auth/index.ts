import { COMMAND_PALETTE_ITEM_TYPE, MODAL_SIZE, current_user } from "@ordo-pink/core"
import { Maoka, maoka_dom } from "@ordo-pink/maoka"
import { bs_box_arrow_in_right, bs_box_arrow_right } from "@ordo-pink/frontend-icons"
import { get_device_info } from "@ordo-pink/get-device-info"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

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
	const { fetch, hosts } = use(maoka_sdk.context.consume)

	const handle_mount = () => {
		const refresh_session0 = oath
			.of(new Headers())
			.pipe(oath.ops.tap(h => h.append("X-Device", get_device_info(navigator))))
			.pipe(oath.ops.map(headers => ({ headers, method: "POST", credentials: "include" }) as const))
			.pipe(oath.ops.chain(init => oath.from_promise(() => fetch(`${hosts.id}/session`, init))))
			.pipe(oath.ops.and(res => res.json()))
			.pipe(oath.ops.chain(res => oath.if(res.success, { on_true: () => res.payload as Ordo.User.Current.DTO })))
			.pipe(oath.ops.map(current_user.from_dto))
			.pipe(oath.ops.tap(user => auth$.update("user", () => user)))

		// TODO Sign out on error
		refresh_session0.cata(oath.catas.to_promise()).catch(noop)

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
				})

				release_join = noop
				release_verify_code = noop

				hunter.shoot("command_palette.add", {
					id: COMMAND_PALETTE_SIGN_OUT_ID,
					readable_name: "auth_commands_sign_out_name",
					render_icon: span => maoka_dom.render(span, bs_box_arrow_right({}), node.root.create_id),
					value: () => hunter.shoot("auth.sign_out"),
					description: "auth_commands_sign_out_description",
					type: COMMAND_PALETTE_ITEM_TYPE.DESTRUCTIVE_ACTION,
				})
			} else {
				release_join = hunter.track("auth.show_request_code_modal", () => {
					hunter.shoot("modal.show", {
						size: MODAL_SIZE.SM,
						render: div => maoka_dom.render(div, maoka_sdk.components.with_state(state, join_modal), node.root.create_id),
					})
				})

				release_verify_code = hunter.track("auth.show_verify_code_modal", () => {
					hunter.shoot("modal.show", {
						size: MODAL_SIZE.SM,
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
					type: COMMAND_PALETTE_ITEM_TYPE.MODAL_OPENER,
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

declare global {
	interface t {
		auth: {
			commands: {
				join: {
					description: string
					name: string
				}
				sign_out: {
					description: string
					name: string
				}
			}
			common: {
				cancel: string
			}
			modals: {
				join: {
					title: string
					hint: string
					join: string
				}
				verify: {
					title: string
					hint: string
					submit: string
				}
			}
		}
	}
}
