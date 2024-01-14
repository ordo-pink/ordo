// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useDataByLabel } from "$hooks/use-data.hook"
import { useInbox } from "./use-inbox"

export const useGtdProjects = () => {
	const gtd = useDataByLabel(["gtd", "project"])
	const inbox = useInbox()

	return gtd.filter(data => !inbox.some(item => item.fsid === data.fsid))
}
