import { type Oath } from "../../oath.types"
import { create } from "../../constructors"

export const map_op: Oath.Operators.Map = f => o =>
	create((resolve, reject) =>
		o.cata({
			reject,
			resolve: x => resolve(f(x)),
		}),
	)

export const rejected_map_op: Oath.Operators.RejectedMap = f => o =>
	create((resolve, reject) =>
		o.cata({
			reject: x => reject(f(x)),
			resolve,
		}),
	)

export const bimap_op: Oath.Operators.BiMap = (f, g) => o =>
	create((resolve, reject) =>
		o.cata({
			reject: x => reject(g(x)),
			resolve: x => resolve(f(x)),
		}),
	)
