import { PropsWithChildren } from "react"

export default function DataLabel({ children }: PropsWithChildren) {
	return (
		<div className="text-xs shadow-sm whitespace-nowrap text-neutral-500 bg-neutral-200 dark:bg-neutral-900 rounded-md px-1 py-0.5">
			{children}
		</div>
	)
}
