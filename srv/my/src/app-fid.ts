import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { ORDO_PINK_APP_FUNCTION } from "@ordo-pink/core"

export const APP_FID = KnownFunctions.register(ORDO_PINK_APP_FUNCTION, {
	commands: [],
	queries: [],
})!

export const isDev = import.meta.env.DEV
