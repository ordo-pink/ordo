import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const create_welcome_workspace = (ctx: Ordo.CreateFunction.Params) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))

		const $ = use(MaokaOrdo.Jabs.IsAuthenticated$)
		const get_is_authenticated = use(MaokaOrdo.Jabs.from$($, false))

		return async () => {
			const is_authenticated = get_is_authenticated()

			return is_authenticated
				? Maoka.lazy(() => import("./pages/welcome.page"))
				: Maoka.lazy(() => import("./pages/landing.page"))
		}
	})
