import { createHash } from "crypto"

export type Hashed<T extends Record<string, unknown>> = T & { hash: string }

export const hashResponse = <T extends Record<string, unknown>>(response: T): Hashed<T> => ({
	...response,
	hash: createHash("sha1").update(JSON.stringify(response)).digest("hex"),
})
