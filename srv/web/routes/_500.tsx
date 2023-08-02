import { ErrorPageProps } from "$fresh/server.ts"
import { CenteredPage } from "../components/centered-page.tsx"

export default function Error500Page({ error }: ErrorPageProps) {
	return (
		<CenteredPage
			centerX
			centerY
		>
			<h1 class="text-5xl md:text-9xl text-center">BOOM!</h1>
			<p class="text-center">{(error as Error).message}</p>
		</CenteredPage>
	)
}
