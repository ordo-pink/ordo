import { PropsWithChildren } from "react"

type Props = {}

export const PageHeader = ({ children }: PropsWithChildren<Props>) => (
	<h1 className="text-4xl font-black first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent">
		{children}
	</h1>
)
