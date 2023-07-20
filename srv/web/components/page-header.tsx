import { Head } from "$fresh/runtime.ts"
import { RenderableProps } from "preact"

type Props = {}

export const PageHeader = ({ children }: RenderableProps<Props>) => (
	<h1 class="text-4xl font-black first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent">
		<Head>
			<title>Ordo.pink | {children}</title>
		</Head>

		{children}
	</h1>
)
