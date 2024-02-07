import { KnownFunctions } from "@ordo-pink/known-functions"
import { ORDO_PINK_APP_FUNCTION } from "@ordo-pink/core"

export const APP_FID = KnownFunctions.register(ORDO_PINK_APP_FUNCTION, {
	commands: [],
	queries: [],
})!

export const idHost = import.meta.env.VITE_ORDO_ID_HOST
export const webHost = import.meta.env.VITE_ORDO_WEBSITE_HOST
export const staticHost = import.meta.env.VITE_ORDO_STATIC_HOST
export const isDev = import.meta.env.DEV
