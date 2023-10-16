import { useDataSelector } from "$hooks/use-data-selector"

export const useGtdProjects = () =>
	useDataSelector(items =>
		Array.from(
			new Set(
				items.flatMap(item =>
					item.labels
						.filter(label => label.startsWith("projects/"))
						.map(project => project.replace("projects/", "")),
				),
			),
		),
	) ?? []
