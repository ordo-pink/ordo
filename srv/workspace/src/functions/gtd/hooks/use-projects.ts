// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useDataSelector } from "$hooks/use-data.hook"

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
