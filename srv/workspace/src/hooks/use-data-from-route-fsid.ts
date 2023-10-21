// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { FSID, PlainData } from "@ordo-pink/data"
import { useEffect, useState } from "react"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { Either } from "@ordo-pink/either"

type UseDataFromRouteFSID = () => PlainData | null

/**
 * Returns PlainData object identified by FSID provided in the current route. Requires `:fsid` to
 * be defined in the current route. Returns `null` if `:fsid` does not exist in the current route,
 * or if there is not PlainData identified by the FSID provided in the current route.
 *
 * @type {UseDataFromRouteFSID}
 */
export const useDataFromRouteFSID: UseDataFromRouteFSID = () => {
	const { data, route } = useSharedContext()
	const [currentData, setCurrentData] = useState<PlainData | null>(null)

	useEffect(() => {
		if (!route || !route.params || !data) return void setCurrentData(null)

		const setCurrentDataBoth = [setCurrentData, setCurrentData] as const
		const checkRouteHasFSID = () => !!route.params.fsid
		const getRouteFSID = () => route.params.fsid as FSID

		Either.fromBoolean(checkRouteHasFSID, getRouteFSID, getNull)
			.chain(fsid => Either.fromNullable(data.find(item => item.fsid === fsid)))
			.fold(...setCurrentDataBoth)
	}, [data, route])

	return currentData
}

// --- Internal ---

const getNull = () => null
