import { maoka } from "@ordo-pink/oss-maoka"

type Args = { state: OrdoClient.F.State }
export const filet_workspace = maoka.create<Args>("div", ({ state, use }) => {
	use(ordo_client_maoka.context.provide(state))

	return () => "Hello from Filet"
})
