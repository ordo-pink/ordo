import { CenteredPage } from "../components/centered-page.tsx"

export default function Error404Page() {
	return (
		<CenteredPage
			centerX
			centerY
		>
			<h1 class="text-5xl md:text-9xl text-center">404</h1>
			<p class="text-center">Everybody is looking for something</p>
		</CenteredPage>
	)
}
