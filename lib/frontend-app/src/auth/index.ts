import { COMMAND_PALETTE_ITEM_TYPE, MODAL_SIZE, current_user } from "@ordo-pink/core"
import { Maoka, maoka_dom } from "@ordo-pink/maoka"
import { bs_box_arrow_in_right } from "@ordo-pink/frontend-icons"
import { get_device_info } from "@ordo-pink/get-device-info"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

import { app_context } from "../../app-context"
import { auth$ } from "./auth.state"
import { join_modal } from "./components/join.component"

export const auth_jab: Maoka.Jab = ({ use }) => {
	use(internal.refresh_session_jab)
}

namespace internal {
	const COMMAND_PALETTE_JOIN_ID = "auth.join"

	export const refresh_session_jab: Maoka.Jab = ({ use, node }) => {
		const { fetch, hosts, hunter } = use(app_context.consume)

		const handle_mount = () => {
			const release_join = hunter.track("auth.show_request_code_modal", () => {
				hunter.shoot("modal.show", {
					size: MODAL_SIZE.MD,
					render: div => maoka_dom.render(div, join_modal(), node.root.create_id),
				})
			})

			hunter.shoot("command_palette.add", {
				id: COMMAND_PALETTE_JOIN_ID,
				readable_name: "Join",
				render_icon: span => maoka_dom.render(span, bs_box_arrow_in_right({}), node.root.create_id),
				value: () => hunter.shoot("auth.show_request_code_modal"),
				description: "Sign up/sign in. Make sure you enter email correcly - we'll send a code there.",
				type: COMMAND_PALETTE_ITEM_TYPE.MODAL_OPENER,
			})

			const refresh_session0 = oath
				.of(new Headers())
				.pipe(oath.ops.tap(h => h.append("X-Device", get_device_info(navigator))))
				.pipe(oath.ops.map(headers => ({ headers, method: "POST", credentials: "include" }) as const))
				.pipe(oath.ops.chain(init => oath.from_promise(() => fetch(`${hosts.id}/session`, init))))
				.pipe(oath.ops.and(res => res.json()))
				.pipe(oath.ops.chain(res => oath.if(res.success, { on_true: () => res.payload as Ordo.User.Current.DTO })))
				.pipe(oath.ops.map(current_user.from_dto))
				.pipe(oath.ops.tap(user => auth$.update("user", () => user)))

			refresh_session0.cata(oath.catas.to_promise()).catch(noop)

			return () => {
				refresh_session0.cancel("Root component refreshed")
				hunter.shoot("command_palette.remove", COMMAND_PALETTE_JOIN_ID)
				release_join()
			}
		}

		use(maoka_dom.jabs.onmount(handle_mount))
	}
}
