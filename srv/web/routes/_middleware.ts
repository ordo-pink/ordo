import { MiddlewareHandlerContext } from "$fresh/server.ts"
import { getCookies } from "#std/http/cookie.ts"
import { getc } from "#lib/getc/mod.ts"

const { APP_HOST } = getc(["APP_HOST"])

export const handler = (req: Request, ctx: MiddlewareHandlerContext) => {
	const cookies = getCookies(req.headers)
	const url = new URL(req.url)
	const hasRequiredCookies = Boolean(cookies.jti && cookies.sub)

	if (
		hasRequiredCookies &&
		["/sign-in", "/sign-up", "/forgot-password", "/"].includes(url.pathname)
	) {
		return new Response(null, { status: 307, headers: new Headers({ Location: APP_HOST }) })
	}

	if (!hasRequiredCookies && url.pathname.startsWith("/~")) {
		return new Response(null, { status: 307, headers: new Headers({ Location: "/sign-in" }) })
	}

	return ctx.next()
}
