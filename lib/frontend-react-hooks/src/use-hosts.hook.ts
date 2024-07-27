import { THosts } from "@ordo-pink/core"
import { use$ } from ".."

export const useHosts = () => {
	const { get_hosts, is_dev } = use$.ordo_context()
	const logger = use$.logger()

	return get_hosts().cata({
		Ok: hosts => hosts,
		Err: error => {
			is_dev && logger.notice(`${error.code} [${error.key}] ${error.location} :: ${error.debug}`)

			return {} as THosts
		},
	})
}
