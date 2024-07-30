import { RRR } from "@ordo-pink/data"
import { Result } from "@ordo-pink/result"
import { type TGetHostsFn } from "@ordo-pink/core"

import { type TInitCtx } from "../frontend-client.types"

type TInitHostsFn = (params: Pick<TInitCtx, "logger" | "hosts" | "known_functions">) => {
	get_hosts: TGetHostsFn
}
export const init_hosts: TInitHostsFn = ({ logger, hosts, known_functions }) => {
	logger.debug("🟢 Initialised hosts.")

	return {
		get_hosts: fid => () =>
			Result.If(known_functions.has_permissions(fid, { queries: ["application.hosts"] }))
				.pipe(Result.ops.err_map(() => eperm(`get_hosts -> fid: ${String(fid)}`)))
				.pipe(Result.ops.map(() => hosts)),
	}
}

const eperm = RRR.codes.eperm("init_hosts")
