import { all, merge } from "./impl/merge.impl"
import { empty, reject, resolve } from "./impl/of.impl"
import { type Oath } from "../oath.types"
import { create } from "./impl/create.impl"
import { from_nullable } from "./impl/from-nullable.impl"
import { from_promise } from "./impl/from-promise.impl"
import { iif } from "./impl/if.impl"
import { tryy } from "./impl/try.impl"

export * from "./impl/create.impl"
export * from "./impl/from-nullable.impl"
export * from "./impl/from-promise.impl"
export * from "./impl/if.impl"
export * from "./impl/merge.impl"
export * from "./impl/of.impl"
export * from "./impl/try.impl"

export const constructors: Oath.Constructors.Static = {
	all,
	empty,
	from_nullable,
	from_promise,
	if: iif,
	merge,
	new: create,
	of: resolve,
	resolve,
	reject,
	try: tryy,
}
