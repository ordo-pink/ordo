import { Maoka, maoka_dom } from "@ordo-pink/maoka"
import { current_user } from "@ordo-pink/core"
import { get_device_info } from "@ordo-pink/get-device-info"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

import { app_context } from "../../app-context"
import { auth$ } from "./auth.state"

export const auth_jab: Maoka.Jab = ({ use }) => {
	use(internal.refresh_session_jab)
}

namespace internal {
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

			refresh_session0.cata(oath.catas.to_promise()).catch(noop)

			return () => refresh_session0.cancel("Root component refreshed")
		}

		use(maoka_dom.jabs.onmount(handle_mount))
	}
}
