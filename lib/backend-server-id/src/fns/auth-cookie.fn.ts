import { type Context } from "koa"

import { type JTI, type SUB } from "@ordo-pink/wjwt"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/data"
import { is_uuid } from "@ordo-pink/tau"

export const set_auth_cookie = (ctx: Context, sub: SUB, jti: JTI, expires: Date): void => {
	ctx.response.set(
		"Set-Cookie",
		`jti=${jti}; Expires=${expires.toISOString()}; SameSite=Lax; Path=/; HttpOnly;`,
	)

	ctx.response.set(
		"Set-Cookie",
		`sub=${sub}; Expires=${expires.toISOString()}; SameSite=Lax; Path=/; HttpOnly;`,
	)
}

export const remove_auth_cookie = (ctx: Context) => () => {
	ctx.response.set("Set-Cookie", "jti=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;")
	ctx.response.set("Set-Cookie", "sub=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;")
}

export const get_auth_cookies0 = (sub?: string, jti?: string) =>
	Oath.Merge({
		sub: Oath.FromNullable(sub)
			.pipe(Oath.ops.chain(sub => Oath.If(is_uuid(sub), { T: () => sub as SUB, F: () => sub })))
			.pipe(Oath.ops.rejected_map(sub => eacces(`get_auth_cookies -> sub: ${sub}`))),
		jti: Oath.FromNullable(jti)
			.pipe(Oath.ops.chain(jti => Oath.If(is_uuid(jti), { T: () => jti as JTI, F: () => jti })))
			.pipe(Oath.ops.rejected_map(jti => eacces(`get_auth_cookies -> jti: ${jti}`))),
	})

// --- Internal ---

const LOCATION = "cookies"

const eacces = RRR.codes.eacces(LOCATION)
