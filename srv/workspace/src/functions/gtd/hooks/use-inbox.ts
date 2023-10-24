// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useDataFilter } from "$hooks/use-data.hook"

export const useInbox = () =>
	useDataFilter(
		item =>
			item.labels.includes("todo") && !item.labels.some(label => label.startsWith("projects/")),
	)
