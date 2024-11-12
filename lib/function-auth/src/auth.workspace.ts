import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

export const AuthWorkspace = (ctx: Ordo.CreateFunction.Params) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("size-full"))

		const get_route_params = use(MaokaOrdo.Jabs.RouteParams)

		return async () => {
			const { action } = get_route_params()

			return Switch.Match(action)
				.case("authenticate", () => Maoka.lazy(() => import("./components/authenticate.component")))
				.case("recover", () => "TODO")
				.default(noop)
		}
	})
