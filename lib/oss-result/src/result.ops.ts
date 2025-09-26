import * as Result from "./result.types"
import { err, ok } from "./result.impl"

export const map: Result.Map = f => r => r.cata({ ok: x => ok(f(x)), err: x => err(x) })

export const rmap: Result.RMap = f => r => r.cata({ ok: x => ok(x), err: x => err(f(x)) })

export const bimap: Result.BiMap = (f, g) => r => r.cata({ ok: x => ok(g(x)), err: x => err(f(x)) as any })

export const chain: Result.Chain = f => r => r.cata({ ok: x => f(x), err: x => err(x) })

export const rchain: Result.RChain = f => r => r.cata({ ok: x => ok(x), err: x => f(x) as any })

export const tap: Result.Tap = (f, g) => r => {
	r.cata({ ok: f, err: x => (g ? g(x) : void 0) })
	return r
}

export const rtap: Result.RTap = (f, g) => r => {
	r.cata({ ok: x => (g ? g(x) : void 0), err: f })
	return r
}

export const swap: Result.Swap = () => r => r.cata({ ok: x => err(x), err: x => ok(x) })
