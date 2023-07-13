import { Application, etag, Router } from "#x/oak@v12.6.0/mod.ts"
import { oakCors } from "#x/cors@v1.2.2/mod.ts"

const PORT = Deno.env.get("ID_PORT")
const ALLOWED_ORIGIN = Deno.env.get("ID_ALLOWED_ORIGIN")

const port = PORT ? Number(PORT) : 3001
const origin = ALLOWED_ORIGIN ?? "https://ordo.pink"

const router = new Router()

router.get("/healthcheck", ctx => {
	ctx.response.body = "OK"
	ctx.response.status = 200
})

const app = new Application({
	state: {
		logger: {
			log: console.log,
		},
	},
})

app.use(async (ctx, next) => {
	await next()

	const rt = ctx.response.headers.get("X-Response-Time")
	const message = `${ctx.request.method} ${ctx.request.url} - ${rt}`

	ctx.app.state.logger.log(message)
})

app.use(async (ctx, next) => {
	const start = Date.now()

	await next()

	const ms = Date.now() - start
	ctx.response.headers.set("X-Response-Time", `${ms}ms`)
})

app.use(etag.factory())
app.use(oakCors({ origin }))
app.use(router.routes())
app.use(router.allowedMethods())

console.log(`ID server running on port ${port}`)

await app.listen({ port })
