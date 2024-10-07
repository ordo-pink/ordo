import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Result } from "@ordo-pink/result"

export const WelcomeWorkspace = (ctx: Ordo.CreateFunction.Params) =>
	Maoka.create("div", ({ use, refresh }) => {
		use(MaokaOrdo.Context.provide(ctx))

		let is_authenticated = false

		const $ = use(MaokaOrdo.Jabs.IsAuthenticated$)
		const handle_is_authenticated_update = (value: boolean) =>
			Result.If(is_authenticated !== value)
				.pipe(Result.ops.map(() => void (is_authenticated = value)))
				.cata(Result.catas.if_ok(refresh))

		use(MaokaOrdo.Jabs.subscribe($, handle_is_authenticated_update))

		return () => {
			// TODO Render home if user is authenticated
			return Maoka.lazy(() => import("./pages/landing.page"))
		}
	})
