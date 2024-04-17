import { of0 } from "@ordo-pink/oath"

export const generateEmailCode0 = () =>
	of0<string>(crypto.getRandomValues(new Uint32Array(3)).join(""))
