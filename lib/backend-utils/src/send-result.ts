import { type Context } from "koa"

type TSendSuccessParams<T> = {
	ctx: Context
	callback?: (result: T) => any
	status?: number
}

export const sendSuccess =
	<T>(params: TSendSuccessParams<T>) =>
	(result: T) => {
		const callback = params.callback ?? (x => x)
		const status = params.status ?? 200

		params.ctx.response.status = status
		params.ctx.response.body = { success: true, result: callback(result) }
	}
