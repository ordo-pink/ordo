import { create, from_promise } from "../../constructors"
import { Oath } from "../../oath.types"

export const fix_op: Oath.Operators.Fix = on_reject => o =>
	create((resolve, reject) =>
		o.cata({
			resolve: resolved => resolve(resolved),
			reject: rejected => {
				try {
					const forked: any = on_reject(rejected)

					if (!forked) return resolve(forked)
					if (forked.is_oath) return forked.cata({ reject, resolve })
					if (forked.then) return from_promise(() => forked).cata({ resolve, reject } as any)
					return resolve(forked)
				} catch (e) {
					reject(e as never)
				}
			},
		}),
	) as any
