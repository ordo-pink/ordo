import { Context } from "#x/oak@v12.6.0/mod.ts"

export type THttpError = readonly [number, string]

export const sendError = (ctx: Context) => (err: THttpError | unknown) => {
	if (
		Array.isArray(err) &&
		err.length === 2 &&
		typeof err[0] === "number" &&
		typeof err[1] === "string" &&
		err[0] >= 100 &&
		err[0] < 600
	) {
		const [status, message] = err

		ctx.response.status = status
		ctx.response.body = { error: message }
	} else {
		ctx.response.status = 500
		console.log(err)
		ctx.response.body = {
			error: err && (err as any).message ? (err as any).message : "Unknown error",
		}
	}
}

export const createHttpError =
	(status: number, message: string) =>
	(e: unknown): [number, string] =>
		e ? (e as any) : [status, message]

export const useResponseError = () => ({
	create: createHttpError,
	send: sendError,
})

export const ResponseError = useResponseError()
