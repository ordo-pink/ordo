import { BodyType, Context } from "#x/oak@v12.6.0/mod.ts"
import { isObject } from "#lib/tau/mod.ts"

export const useBody = async <T>(
	ctx: Context,
	type: BodyType = "json",
	expect: "string" | "array" | "object" = "object"
): Promise<T> => {
	const bodyContent = ctx.request.body({ type })

	const body: T = await bodyContent.value

	if (expect === "object" && !isObject(body)) {
		ctx.throw(400, "Request body must be an object")
	} else if (expect === "string" && typeof body !== "string") {
		ctx.throw(400, "Request body must be a string")
	} else if (expect === "array" && !Array.isArray(body)) {
		ctx.throw(400, "Request body must be an array")
	}

	return body
}
