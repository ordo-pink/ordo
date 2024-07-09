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

import {
	DataQuery,
	DataRepository,
	type FSID,
	type PlainData,
	type TMetadata,
} from "@ordo-pink/data"
import { O, TOption } from "@ordo-pink/option"
import { Switch } from "@ordo-pink/switch"
import { data$ } from "@ordo-pink/frontend-stream-data"

import { useQueryContext } from "./use-query-context.hook"
import { useRouteParams } from "./use-route.hook"
import { useStrictSubscription } from "./use-strict-subscription.hook"

type TItemToFSIDParam = TMetadata | FSID | null

const itemToFSID = (item?: TItemToFSIDParam): TOption<FSID> =>
	Switch.empty()
		.case(Boolean(item && (item as TMetadata).getFSID), () => O.some((item as TMetadata).getFSID()))
		.case(typeof item === "string", () => O.some(item as FSID))
		.default(() => O.none())

export const useChildren_m = (
	item?: TItemToFSIDParam,
	showHidden = false,
): TOption<TMetadata[]> => {
	const { metadataQuery } = useQueryContext()

	return itemToFSID(item).cata({
		Some: fsid =>
			metadataQuery.getChildren(fsid, { showHidden }).cata({ Ok: x => x, Err: () => O.none() }),
		None: () => O.none(),
	})
}

export const useChildren = (item: PlainData | FSID | "root" | null, showHidden = false) => {
	const data = useData(showHidden)

	const fsid = Switch.empty()
		.case(Boolean(item && (item as PlainData).fsid), () => (item as PlainData).fsid)
		.case(typeof item === "string" && item !== "root", () => item as FSID)
		.default(() => null)

	return Switch.empty()
		.case(!data || !item, () => [])
		.default(() => data.filter(item => item.parent === fsid))
}

export const useDataO = (showHidden?: boolean): TOption<TMetadata[]> => {
	const { metadataQuery } = useQueryContext()

	return metadataQuery.get({ showHidden }).cata({ Ok: x => x, Err: O.none })
}

export const useData = (showHidden = false) => {
	const [items, setItems] = useState<PlainData[]>([])

	const data = useStrictSubscription(data$, [])

	useEffect(() => {
		setItems(
			showHidden
				? data
				: data.filter(
						item =>
							!item.name.startsWith(".") &&
							!DataRepository.getParentChain(data, item.fsid).some(parent =>
								parent.name.startsWith("."),
							),
					),
		)
	}, [showHidden, data])

	return items
}

export const useChildTree = (source?: PlainData | FSID | null | "root") => {
	return DataQuery.of(data$).getDataTreeE(source)
}

export const useLabelsO = (showHidden?: boolean): TOption<string[]> => {
	const dataOption = useDataO(showHidden)

	return dataOption.cata({
		Some: data => O.some(Array.from(new Set(data.flatMap(item => item.getLabels()) ?? []))),
		None: () => O.none(),
	})
}

export const useDataLabels = (showHidden = false) => {
	const data = useData(showHidden)

	return Array.from(new Set(data?.flatMap(item => item.labels) ?? []))
}

export const useDataByLabelsO = (labels: string[], showHidden?: boolean): TOption<TMetadata[]> => {
	const { metadataQuery } = useQueryContext()

	return metadataQuery.getByLabels(labels, { showHidden }).cata({ Err: () => O.none(), Ok: x => x })
}

export const useDataByLabel = (labels: string[]) =>
	useSelectDataList(item => labels.every(label => item.labels.includes(label)))

export const useAncestorsO = (
	item: TItemToFSIDParam,
	showHidden?: boolean,
): TOption<TMetadata[]> => {
	const { metadataQuery } = useQueryContext()

	return itemToFSID(item)
		.pipe(O.ops.map(fsid => metadataQuery.getAncestors(fsid, { showHidden })))
		.pipe(O.ops.chain(O.fromResult))
}

export const useParentChain = (fsid: FSID, showHidden = false) => {
	const data = useData(showHidden)
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

export const useDataByFSIDO = (fsid?: FSID | null, showHidden?: boolean): TOption<TMetadata> => {
	const { metadataQuery } = useQueryContext()

	return O.fromNullable(fsid).cata({
		Some: fsid =>
			metadataQuery.getByFSID(fsid, { showHidden }).cata({ Ok: x => x, Err: () => O.none() }),
		None: () => O.none(),
	})
}

export const useDataByName = (name: string, parent: FSID | null) => {
	const data = useSelectData(item => item.name === name && item.parent === parent)

	return data
}

export const useSelectDataList = (selector: (data: PlainData) => boolean, showHidden = false) => {
	const data = useData(showHidden)

	return data.filter(selector)
}

export const useSelectData = (selector: (data: PlainData) => boolean, showHidden = false) => {
	const data = useData(showHidden)

	return data.find(selector) ?? null
}

export const useDataFromRouteFSID = () => {
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const data = useDataByFSID(fsid)

	return data
}

// export const useDataTree = (showHidden = false) => {
// 	const data = useData(showHidden)

// 	const [tree, setTree] = useState<PlainDataNode[]>([])

// 	useEffect(() => {
// 		Either.fromNullable(data)
// 			.map(data => {
// 				const tree = [] as PlainDataNode[]
// 				const intermediateTree = {} as Record<FSID, PlainDataNode>

// 				data.forEach(item => void (intermediateTree[item.fsid] = createNode(item)))
// 				data.forEach(item =>
// 					item.parent
// 						? intermediateTree[item.fsid].children.push(item)
// 						: tree.push(intermediateTree[item.fsid]),
// 				)

// 				return tree
// 			})
// 			.fold(() => setTree([]), setTree)
// 	}, [data])

// 	return tree
// }

// const createNode = (data: PlainData): PlainDataNode => ({
// 	data,
// 	id: data.fsid,
// 	parent: data.parent,
// 	children: [],
// })
