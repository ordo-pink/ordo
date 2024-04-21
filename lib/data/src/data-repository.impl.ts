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

import { Either } from "@ordo-pink/either"
import { type PlainDataNode } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"

import { FSID, PlainData } from "./data.types"

export const DataRepository = {
	dropHidden: (data: PlainData[]) =>
		data.filter(item => {
			const parents = DataRepository.getParentChain(data, item.fsid)
			return !item.name.startsWith(".") && !parents.some(parent => parent.name.startsWith("."))
		}),
	getChildren: (data: PlainData[] | null, item: PlainData | FSID | "root" | null) => {
		const fsid = Switch.empty()
			.case(Boolean(item && (item as PlainData).fsid), () => (item as PlainData).fsid)
			.case(typeof item === "string" && item !== "root", () => item as FSID)
			.default(() => null)

		return Switch.empty()
			.case(!data || !item, () => [])
			.default(() => data!.filter(item => item.parent === fsid))
	},
	getAllLabels: (data: PlainData[] | null) => {
		return Array.from(new Set(data?.flatMap(item => item.labels) ?? []))
	},
	getParentChain: (data: PlainData[] | null, fsid: FSID) => {
		let currentItem = DataRepository.getDataByFSID(data, fsid)

		const parentChain = [] as PlainData[]

		if (!data || !currentItem) return parentChain

		parentChain.push(currentItem)

		while (currentItem && currentItem.parent !== null) {
			const parent = data?.find(x => x.fsid === currentItem?.parent) ?? null

			if (parent) parentChain.push(parent)

			currentItem = parent
		}

		return parentChain.reverse()
	},
	getDataByFSID: (data: PlainData[] | null, fsid: FSID) =>
		DataRepository.findData(data, item => item.fsid === fsid),
	filterDataByLabel: (data: PlainData[] | null, labels: string | string[]) => {
		if (!Array.isArray(labels)) labels = [labels]

		return DataRepository.filterData(data, item =>
			(labels as string[]).every(label => item.labels.includes(label)),
		)
	},
	filterData: (data: PlainData[] | null, selector: (data: PlainData) => boolean) =>
		data?.filter(selector) ?? [],
	findData: (data: PlainData[] | null, selector: (data: PlainData) => boolean) =>
		data?.find(selector) ?? null,
	getDataTree: (data: PlainData[] | null) =>
		Either.fromNullable(data)
			.map(data => {
				const tree = [] as PlainDataNode[]
				const intermediateTree = {} as Record<FSID, PlainDataNode>

				data.forEach(item => void (intermediateTree[item.fsid] = createDataNode(item)))
				data.forEach(item =>
					item.parent
						? intermediateTree[item.fsid].children.push(item)
						: tree.push(intermediateTree[item.fsid]),
				)

				return tree
			})
			.fold(
				() => [] as PlainDataNode[],
				result => result,
			),
}

const createDataNode = (data: PlainData): PlainDataNode => ({
	data,
	id: data.fsid,
	parent: data.parent,
	children: [],
})
