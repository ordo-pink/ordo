import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts"

export const config: RouteConfig = {
	routeOverride: "/:username/:path*",
}

export const handler: Handlers = {
	GET(_, ctx) {
		ctx.params.path = `/${ctx.params.path}`

		return ctx.render()
	},
}

export default function SharedPage({ params }: PageProps) {
	return <div>{JSON.stringify(params)}</div>
}
