import { type Context } from "koa"

export const send_success =
	({ ctx }: { ctx: Context }) =>
	<$TBody, T extends { status: number; body?: $TBody }>(result: T) => {
		ctx.response.status = result.status
		ctx.response.body = result.status === 204 ? "" : { success: true, result: result.body }
	}
