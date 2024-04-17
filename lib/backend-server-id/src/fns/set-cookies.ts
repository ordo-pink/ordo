import { type Response } from "koa"

import { type JTI, type SUB } from "@ordo-pink/wjwt"

export const setOrdoAuthCookies = (response: Response, expires: Date, jti: JTI, sub: SUB): void => {
	response.set("Set-Cookie", [
		`jti=${jti}; Expires=${expires.toISOString()}; SameSite=Lax; Path=/; HttpOnly;`,
		`sub=${sub}; Expires=${expires.toISOString()}; SameSite=Lax; Path=/; HttpOnly;`,
	])
}
