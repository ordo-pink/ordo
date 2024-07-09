import { O } from "../option.impl"
import { TOptionChainOperatorFn } from "../option.types"

export const chainO: TOptionChainOperatorFn = f => o =>
	o.cata({ Some: v => f(v), None: () => O.none() })
