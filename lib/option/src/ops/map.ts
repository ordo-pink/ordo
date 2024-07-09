import { O } from "../option.impl"
import { type TOptionMapOperatorFn } from "../option.types"

export const mapO: TOptionMapOperatorFn = f => o =>
	o.cata({ Some: v => O.some(f(v)), None: () => O.none() })
