import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts"
import { CenteredPage } from "../../components/centered-page.tsx"
import App from "../../islands/app.tsx"

export const config: RouteConfig = {
	routeOverride: "/~/:activity/:path*",
}

export const handler: Handlers = {
	GET(_, ctx) {
		ctx.params.path = `/${ctx.params.path}`

		return ctx.render()
	},
}

export default function WorkspacePage({ params }: PageProps) {
	return (
		<CenteredPage>
			<App />
		</CenteredPage>
	)
}
