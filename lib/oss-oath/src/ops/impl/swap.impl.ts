import type { Oath } from "../../oath.types"
import { create } from "../../constructors"

export const swap_op: Oath.Ops.Swap = o =>
	create((resolve, reject) => o.cata({ reject: x => resolve(x), resolve: x => reject(x) }))
