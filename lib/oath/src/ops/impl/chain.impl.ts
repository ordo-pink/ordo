import { type Oath } from "../../oath.types"
import { create } from "../../constructors"

export const chain_op: Oath.Operators.Chain = on_resolve => o =>
	create((resolve, reject) =>
		o.cata({
			reject,
			resolve: x =>
				on_resolve(x).cata({
					reject,
					resolve,
				}),
		}),
	)
