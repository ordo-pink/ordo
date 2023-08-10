import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts"
import { CenteredPage } from "../../components/centered-page.tsx"
import App from "../../islands/app.tsx"
import { getc } from "#lib/getc/mod.ts"

const { ID_HOST, DATA_HOST } = getc(["ID_HOST", "DATA_HOST"])

export const config: RouteConfig = {
	routeOverride: "/~/:activity/",
}

export default function WorkspacePage({ params }: PageProps) {
	return (
		<CenteredPage>
			<App idHost={ID_HOST} dataHost={DATA_HOST} />
		</CenteredPage>
	)
}
