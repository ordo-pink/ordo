import type { GetcFn } from "./types.ts"

export const getc = async <T extends Record<string, unknown>>(
	name: string
): Promise<ReturnType<GetcFn<T>>> => {
	const etc = await import(`#etc/srv/${name}.json`, {
		assert: { type: "json" },
	}).catch(() => ({ default: {} }))
	const usr = await import(`#usr/srv/${name}.json`, {
		assert: { type: "json" },
	}).catch(() => ({ default: {} }))

	return {
		...etc.default,
		...usr.default,
	} as T
}
