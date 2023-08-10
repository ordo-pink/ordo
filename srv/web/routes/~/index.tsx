import { getc } from "#lib/getc/mod.ts"
import { CenteredPage } from "../../components/centered-page.tsx"
import App from "../../islands/app.tsx"

const { ID_HOST, DATA_HOST } = getc(["ID_HOST", "DATA_HOST"])

export default function WorkspacePage() {
	return (
		<CenteredPage>
			<App idHost={ID_HOST} dataHost={DATA_HOST} />
		</CenteredPage>
	)
}
