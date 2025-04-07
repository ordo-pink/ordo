import { Oath } from "../../oath.types"

export const to_promise_cata: Oath.Catas.ToPromise = f => ({
	reject: x => {
		if (f) {
			const resolved = f(x)
			return resolved && typeof resolved.then === "function" ? resolved : Promise.resolve(resolved)
		}

		return x && typeof (x as any).then === "function" ? (x as any) : Promise.resolve(x)
	},
	resolve: x => x && (typeof (x as any).then === "function" ? (x as unknown as Promise<any>) : Promise.resolve(x)),
})
