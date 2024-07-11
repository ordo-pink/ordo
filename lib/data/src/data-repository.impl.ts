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

import { type BehaviorSubject } from "rxjs"

import { Either, type TEither, chainE, fromNullableE, mapE, ofE } from "@ordo-pink/either"
import { type PlainDataNode } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"
import { keys_of } from "@ordo-pink/tau"

import { type FSID, type PlainData } from "./data.types"

export type TDataQuery = {
	getDataE: (showHidden?: boolean) => TEither<PlainData[], null>
	getChildrenE: (
		item: PlainData | FSID | "root" | null,
		showHidden?: boolean,
	) => TEither<PlainData[], null>
	getChildrenRecE: (
		item: PlainData | FSID | "root" | null,
		showHidden?: boolean,
	) => TEither<PlainData[], null>
	getLabelsE: (showHidden?: boolean) => TEither<string[], null>
	getParentChainE: (
		fsid: PlainData | FSID | "root" | null,
		showHidden?: boolean,
	) => TEither<PlainData[], null>
	getDataByFsidE: (fsid: FSID) => TEither<PlainData, null>
	filterDataE: (
		selector: (data: PlainData) => boolean,
		showHidden?: boolean,
	) => TEither<PlainData[], null>
	findDataE: (selector: (data: PlainData) => boolean) => TEither<PlainData, null>
	getDataTreeE: (
		source?: PlainData | FSID | "root" | null,
		showHidden?: boolean,
	) => TEither<PlainDataNode[], null>
}

export const DataQuery = {
	of: (data$: BehaviorSubject<PlainData[] | null> | null): TDataQuery => ({
		getDataE: (showHidden = false) =>
			fromNullableE(data$)
				.pipe(chainE(data$ => fromNullableE(data$.value)))
				.pipe(
					mapE(items =>
						showHidden
							? items
							: items.filter(
									item =>
										!item.name.startsWith(".") &&
										!getParents(items)(item).some(i => i.name.startsWith(".")),
								),
					),
				),
		getChildrenE: (item, showHidden = false) =>
			ofE(toFSID(item)).pipe(
				chainE(fsid => DataQuery.of(data$).filterDataE(item => item.parent === fsid, showHidden)),
			),
		getChildrenRecE: (item, showHidden = false) =>
			DataQuery.of(data$)
				.getDataTreeE(item, showHidden)
				.pipe(mapE(children => children.flatMap(child => flattenTree(child)))),
		getLabelsE: showHidden =>
			DataQuery.of(data$)
				.getDataE(showHidden)
				.pipe(mapE(items => Array.from(new Set(items.flatMap(item => item.labels))))),
		getParentChainE: (item, showHidden = false) =>
			DataQuery.of(data$)
				.getDataE(showHidden)
				.pipe(
					chainE(data =>
						fromNullableE(toFSID(item)).pipe(
							chainE(fsid =>
								DataQuery.of(data$)
									.getDataByFsidE(fsid)
									.pipe(mapE(getParents(data))),
							),
						),
					),
				),
		getDataByFsidE: fsid => DataQuery.of(data$).findDataE(item => item.fsid === fsid),
		filterDataE: (selector, showHidden = false) =>
			DataQuery.of(data$)
				.getDataE(showHidden)
				.pipe(mapE(items => items.filter(selector))),
		findDataE: selector =>
			DataQuery.of(data$)
				.getDataE(true)
				.pipe(chainE(items => fromNullableE(items.find(selector)))),
		getDataTreeE: (source, showHidden = false) =>
			ofE(toFSID(source ?? "root"))
				.pipe(
					chainE(fsid =>
						fsid
							? DataQuery.of(data$).getChildrenRecE(fsid, showHidden)
							: DataQuery.of(data$).getDataE(showHidden),
					),
				)

				.pipe(
					mapE(data => {
						const tree = [] as PlainDataNode[]
						const intermediateTree = {} as Record<FSID, PlainDataNode>

						data.forEach(item => {
							intermediateTree[item.fsid] = createDataNode(item)
						})

						console.log(intermediateTree)

						keys_of(intermediateTree).forEach(key => {
							if (
								intermediateTree[key].parent &&
								!intermediateTree[intermediateTree[key].parent as any]
							) {
								console.log(intermediateTree[key])
							}

							intermediateTree[key].parent
								? intermediateTree[intermediateTree[key].parent as any].children.push(
										intermediateTree[key],
									)
								: tree.push(intermediateTree[key])
						})

						return tree
					}),
				),
	}),
}

const getParents =
	(data: PlainData[]) =>
	(currentItem: PlainData): PlainData[] => {
		let i: PlainData | null = currentItem
		const parentChain = [] as PlainData[]

		parentChain.push(i)

		while (i && i.parent !== null) {
			const parent = data?.find(x => x.fsid === currentItem?.parent) ?? null

			if (parent) parentChain.push(parent)

			i = parent
		}

		return parentChain.reverse()
	}

const toFSID = (item: PlainData | FSID | "root" | null) =>
	Switch.empty()
		.case(Boolean(item && (item as PlainData).fsid), () => (item as PlainData).fsid)
		.case(typeof item === "string" && item !== "root", () => item as FSID)
		.default(() => null)

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
						? intermediateTree[item.fsid].children.push(createDataNode(item))
						: tree.push(intermediateTree[item.fsid]),
				)

				return tree
			})
			.fold(
				() => [] as PlainDataNode[],
				result => result,
			),
}

const flattenTree = (node: PlainDataNode, data: PlainData[] = []): PlainData[] =>
	node.children.length === 0
		? data.concat(node.data)
		: node.children.flatMap(child => flattenTree(child, data))

const createDataNode = (data: PlainData): PlainDataNode => ({
	data,
	id: data.fsid,
	parent: data.parent,
	children: [],
})
