import { Head } from "#x/fresh@1.2.0/runtime.ts"

export default function Home() {
	return (
		<>
			<Head>
				<title>Fresh App</title>
			</Head>
			<div class="p-4 mx-auto max-w-screen-md">
				<p class="my-6">
					Welcome to `fresh`. Try updating this message in the ./routes/index.tsx file, and refresh.
				</p>
			</div>
		</>
	)
}
