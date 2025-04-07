import { type Oath } from "../../oath.types"
import { create } from "../../constructors"
import { map_op } from "./map.impl"

export const ap_op: Oath.Operators.Ap = x => o =>
	create((resolve, reject) =>
		o.pipe(
			map_op(f =>
				x.cata({
					reject: x => reject(x),
					resolve: x => resolve(f(x)),
				}),
			),
		),
	)
