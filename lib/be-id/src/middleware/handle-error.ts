import { Middleware, HttpError } from "#x/oak@v12.6.0/mod.ts"

export const handleError: Middleware = async (ctx, next) => {
	try {
		await next()
	} catch (e) {
		if (e instanceof HttpError) {
			ctx.response.status = e.status
			ctx.response.body = { error: e.message }
		} else {
			console.error(e)
		}
	}
}
