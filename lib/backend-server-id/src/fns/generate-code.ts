import { of_oath } from "@ordo-pink/oath"

export const generateEmailCode0 = () =>
	of_oath<string>(crypto.getRandomValues(new Uint32Array(3)).join(""))
