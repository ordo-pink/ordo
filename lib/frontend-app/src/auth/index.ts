import { COMMAND_PALETTE_ITEM_TYPE, MODAL_SIZE, current_user } from "@ordo-pink/core"
import { Maoka, maoka_dom } from "@ordo-pink/maoka"
import { bs_box_arrow_in_right, bs_box_arrow_right } from "@ordo-pink/frontend-icons"
import { get_device_info } from "@ordo-pink/get-device-info"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

import { app_context } from "../../app-context"
import { auth$ } from "./auth.state"
import { join_modal } from "./components/join.component"
import { verify_code_modal } from "./components/verify-code.component"

import "./auth.styles.css"

/**
 * Auth jab is responsible for providing means of signing in and out.
 */
export const auth_jab: Maoka.Jab = ({ use }) => {
	use(internal.refresh_session_jab)
	use(internal.track_prey_jab)
}

namespace internal {
	export const COMMAND_PALETTE_JOIN_ID = "auth.join"
	export const COMMAND_PALETTE_SIGN_OUT_ID = "auth.sign_out"

	export const refresh_session_jab: Maoka.Jab = ({ use }) => {
		const { fetch, hosts } = use(app_context.consume)

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

	export const track_prey_jab: Maoka.Jab = ({ node, use }) => {
		const state = use(app_context.consume)
		const { hosts, hunter } = state

		const handle_mount = () => {
			let release_join = noop
			let release_verify_code = noop
			let release_sign_out = noop

			const divorce_user = auth$.cheat("user", user => {
				hunter.shoot("command_palette.remove", internal.COMMAND_PALETTE_JOIN_ID)
				hunter.shoot("command_palette.remove", internal.COMMAND_PALETTE_SIGN_OUT_ID)

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
						id: internal.COMMAND_PALETTE_SIGN_OUT_ID,
						readable_name: "Sign out",
						render_icon: span => maoka_dom.render(span, bs_box_arrow_right({}), node.root.create_id),
						value: () => hunter.shoot("auth.sign_out"),
						description: "Terminate current session and remove any locally stored files.",
						type: COMMAND_PALETTE_ITEM_TYPE.DESTRUCTIVE_ACTION,
					})
				} else {
					release_join = hunter.track("auth.show_request_code_modal", () => {
						hunter.shoot("modal.show", {
							size: MODAL_SIZE.SM,
							render: div => maoka_dom.render(div, join_modal(state), node.root.create_id),
						})
					})

					release_verify_code = hunter.track("auth.show_verify_code_modal", () => {
						hunter.shoot("modal.show", {
							size: MODAL_SIZE.SM,
							render: div => maoka_dom.render(div, verify_code_modal(state), node.root.create_id),
						})
					})

					release_sign_out = noop

					hunter.shoot("command_palette.add", {
						id: internal.COMMAND_PALETTE_JOIN_ID,
						readable_name: "Join",
						render_icon: span => maoka_dom.render(span, bs_box_arrow_in_right({}), node.root.create_id),
						value: () => {
							hunter.shoot("auth.show_request_code_modal")
							hunter.shoot("command_palette.hide")
						},
						description: "Sign up/sign in. Make sure you enter email correcly - we'll send a code there.",
						type: COMMAND_PALETTE_ITEM_TYPE.MODAL_OPENER,
						hotkey: "mod+j",
					})
				}

				return () => {
					hunter.shoot("command_palette.remove", internal.COMMAND_PALETTE_JOIN_ID)
					hunter.shoot("command_palette.remove", internal.COMMAND_PALETTE_SIGN_OUT_ID)
					release_join()
					release_verify_code()
					release_sign_out()
					divorce_user()
				}
			})
		}

		use(maoka_dom.jabs.onmount(handle_mount))
	}
}
