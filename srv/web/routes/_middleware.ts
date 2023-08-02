import { MiddlewareHandlerContext } from "$fresh/server.ts"
import { getCookies } from "#std/http/cookie.ts"

export const handler = (req: Request, ctx: MiddlewareHandlerContext) => {
	const cookies = getCookies(req.headers)

	const url = new URL(req.url)

	if (
		cookies.jti &&
		cookies.sub &&
		["/sign-in", "/sign-up", "/forgot-password"].includes(url.pathname)
	) {
		return new Response(null, { status: 307, headers: new Headers({ Location: "/~/" }) })
	}

	if ((!cookies.jti || !cookies.sub) && url.pathname.startsWith("/~")) {
		return new Response(null, { status: 307, headers: new Headers({ Location: "/sign-in" }) })
	}

	return ctx.next()
}
