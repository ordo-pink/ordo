import { Handlers } from "$fresh/server.ts"
import { deleteCookie } from "#std/http/cookie.ts"

export const handler: Handlers = {
	GET: async () => {
		await fetch("http://localhost:3001/sign-out", {
			credentials: "include",
			method: "POST",
		})

		const headers = new Headers()

		deleteCookie(headers, "sub")
		deleteCookie(headers, "jti")

		headers.set("Location", "/")

		return new Response(null, { status: 307, headers })
	},
}
