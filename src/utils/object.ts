export const sortKeys = <T extends Record<string, unknown>>(obj: T): T =>
	Object.keys(obj)
		.sort((a, b) => a.localeCompare(b))
		.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {} as T)
