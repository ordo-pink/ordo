// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useDataByLabel } from "$hooks/use-data.hook"
import { useInbox } from "./use-inbox"

export const useGtdProjects = () => {
	const gtd = useDataByLabel(["gtd"])
	const inbox = useInbox()

	return gtd.filter(item => !inbox.some(i => i.fsid === item.fsid))
}
