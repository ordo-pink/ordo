import { useDataFilter } from "$hooks/use-data.hook"

export const useInbox = () =>
	useDataFilter(
		item =>
			item.labels.includes("todo") && !item.labels.some(label => label.startsWith("projects/")),
	)
