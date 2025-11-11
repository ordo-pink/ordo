import type { Aist } from "@ordo-pink/oss-aist"
import type { Maoka } from "@ordo-pink/oss-maoka"

export const router_pathname$: Maoka.Jab<() => Aist.Pathname> = ({ use }) => {
	const { query } = use(ordo_client_maoka.context.consume)

	return use(ordo_client_maoka.jabs.cheat$(query, "aist.pathname"))
}
