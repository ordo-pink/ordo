import type { Handlers, PageProps, RouteConfig } from "$fresh/server.ts"
import { CenteredPage } from "../../components/centered-page.tsx"
import App from "../../islands/app.tsx"

export default function WorkspacePage() {
	return (
		<CenteredPage>
			<App />
		</CenteredPage>
	)
}
