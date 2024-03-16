// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { useEffect, useState } from "react"

import { type FSID, type PlainData } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { type PlainDataNode } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { data$ } from "@ordo-pink/frontend-stream-data"

import { useRouteParams } from "./use-route.hook"
import { useStrictSubscription } from "./use-strict-subscription.hook"

export const useChildren = (item: PlainData | FSID | "root" | null) => {
	const data = useData()

	const fsid = Switch.empty()
		.case(Boolean(item && (item as PlainData).fsid), () => (item as PlainData).fsid)
		.case(typeof item === "string" && item !== "root", () => item as FSID)
		.default(() => null)

	return Switch.empty()
		.case(!data || !item, () => [])
		.default(() => data.filter(item => item.parent === fsid))
}

export const useData = () => {
	const data = useStrictSubscription(data$, [])

	return data
}

export const useDataLabels = () => {
	const data = useData()

	return Array.from(new Set(data?.flatMap(item => item.labels) ?? []))
}

export const useDataByLabel = (labels: string[]) =>
	useSelectDataList(item => labels.every(label => item.labels.includes(label)))

export const useParentChain = (fsid: FSID) => {
	const data = useData()
	let currentItem = useDataByFSID(fsid)

	const parentChain = [] as PlainData[]

	if (!data || !currentItem || currentItem.parent === null) return parentChain

	while (currentItem && currentItem.parent !== null) {
		const parent = data?.find(x => x.fsid === currentItem?.parent) ?? null

		if (parent) parentChain.push(parent)

		currentItem = parent
	}

	return parentChain.reverse()
}

export const useDataByFSID = (fsid?: FSID | null) => {
	const data = useSelectData(item => item.fsid === fsid)

	return data
}

export const useDataByName = (name: string, parent: FSID | null) => {
	const data = useSelectData(item => item.name === name && item.parent === parent)

	return data
}

export const useSelectDataList = (selector: (data: PlainData) => boolean) => {
	const data = useData()

	return data.filter(selector)
}

export const useSelectData = (selector: (data: PlainData) => boolean) => {
	const data = useData()

	return data.find(selector) ?? null
}

export const useDataFromRouteFSID = () => {
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const data = useDataByFSID(fsid)

	return data
}

export const useDataTree = () => {
	const data = useData()

	const [tree, setTree] = useState<PlainDataNode[]>([])

	useEffect(() => {
		Either.fromNullable(data)
			.map(data => {
				const tree = [] as PlainDataNode[]
				const intermediateTree = {} as Record<FSID, PlainDataNode>

				data.forEach(item => void (intermediateTree[item.fsid] = createNode(item)))
				data.forEach(item =>
					item.parent
						? intermediateTree[item.fsid].children.push(item)
						: tree.push(intermediateTree[item.fsid]),
				)

				return tree
			})
			.fold(() => setTree([]), setTree)
	}, [data])

	return tree
}

const createNode = (data: PlainData): PlainDataNode => ({
	data,
	id: data.fsid,
	parent: data.parent,
	children: [],
})
