export default function DataLabel({ children }: PropsWithChildren) {
	return (
		<div className="whitespace-nowrap rounded-md bg-neutral-200 px-1 py-0.5 text-xs text-neutral-500 shadow-sm transition-all duration-300 hover:ring-1 hover:ring-purple-500 dark:bg-neutral-900">
			{children}
		</div>
	)
}
