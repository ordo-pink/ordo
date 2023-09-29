// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { FSID } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"

export const useData = (fsid: FSID | null) => {
	const { data } = useSharedContext()

	return data?.find(x => x.fsid === fsid) ?? null
}
