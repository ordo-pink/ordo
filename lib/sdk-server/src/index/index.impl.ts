import { core } from "@ordo-pink/sdk-core"

import type { IsPort } from "./index.types"

export const is_port: IsPort = (x): x is string => {
	const n = Number.parseInt(x, 10)
	const gt_0 = core.fns.gt(0)
	const lt_65535 = core.fns.lt(65535)

	return !x.startsWith("0") && !core.fns.is_nan(n) && gt_0(n) && lt_65535(n)
}
