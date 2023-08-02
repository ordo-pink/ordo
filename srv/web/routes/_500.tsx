import { ErrorPageProps } from "$fresh/server.ts"
import { Callout } from "../components/callout.tsx"
import { CenteredPage } from "../components/centered-page.tsx"

export default function Error500Page({ error }: ErrorPageProps) {
	return (
		<CenteredPage
			centerX
			centerY
		>
			<h1 class="text-5xl md:text-9xl text-center mb-8">BOOM!</h1>
			<Callout type="error">{(error as Error).message}</Callout>
		</CenteredPage>
	)
}
