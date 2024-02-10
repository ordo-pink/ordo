import { Either } from "@ordo-pink/either"
import { type PlainDataNode } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"

import { FSID, PlainData } from "./data.types"

export const DataRepository = {
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

		if (!data || !currentItem || currentItem.parent === null) return parentChain

		while (currentItem && currentItem.parent !== null) {
			const parent = data?.find(x => x.fsid === currentItem?.parent) ?? null

			if (parent) parentChain.push(parent)

			currentItem = parent
		}

		return parentChain.reverse()
	},
	getDataByFSID: (data: PlainData[] | null, fsid: FSID) =>
		DataRepository.findData(data, item => item.fsid === fsid),
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
