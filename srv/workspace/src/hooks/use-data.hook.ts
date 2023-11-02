// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { FSID, PlainData } from "@ordo-pink/data"
import { useSharedContext } from "@ordo-pink/frontend-core"

export const useDataSelector = <T>(selector: (data: PlainData[]) => T): NonNullable<T> | null => {
	const { data } = useSharedContext()

	return data ? selector(data) ?? null : null
}

export const useDataFind = (selector: (data: PlainData) => boolean) =>
	useDataSelector(data => data.find(selector))

export const useDataFilter = (selector: (data: PlainData) => boolean) =>
	useDataSelector(data => data.filter(selector)) ?? []

export const useDataByFSID = (fsid?: FSID | null) => useDataFind(item => item.fsid === fsid)

export const useDataByLabel = (labels: string[]) =>
	useDataFilter(item => labels.every(label => item.labels.includes(label)))
