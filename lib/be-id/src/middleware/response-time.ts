import { Middleware } from "#x/oak@v12.6.0/mod.ts"

export const setResponseTimeHeader: Middleware = async (ctx, next) => {
	const start = Date.now()
	await next()
	const ms = Date.now() - start

	ctx.response.headers.set("X-Response-Time", ms.toString())
}
