import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts"
import { CenteredPage } from "../../components/centered-page.tsx"
import App from "../../islands/app.tsx"

export const config: RouteConfig = {
	routeOverride: "/~/:activity/",
}

export default function WorkspacePage({ params }: PageProps) {
	return (
		<CenteredPage>
			<App />
		</CenteredPage>
	)
}
