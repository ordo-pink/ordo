import { Head } from "#x/fresh@1.2.0/runtime.ts"
import IndexHeroSection from "../islands/index-hero.tsx"

// TODO: Compress images
export default function Home() {
	return (
		<>
			<Head>
				<title>Fresh App</title>
				<link
					rel="stylesheet"
					href="/index.css"
				/>
			</Head>
			<IndexHeroSection />
			<div class="p-4 mx-auto max-w-screen-md"></div>
		</>
	)
}
