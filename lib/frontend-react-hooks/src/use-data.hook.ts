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
