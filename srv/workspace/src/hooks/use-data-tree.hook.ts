import { useSharedContext } from "@ordo-pink/core"
import { FSID, PlainData } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { useEffect, useState } from "react"

export const useDataTree = () => {
	const { data } = useSharedContext()

	const [tree, setTree] = useState<DataNode[]>([])

	useEffect(() => {
		Either.fromNullable(data)
			.map(data => {
				const tree = [] as DataNode[]
				const intermediateTree = {} as Record<FSID, DataNode>

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

type DataNode = { data: PlainData; id: FSID; parent: FSID | null; children: PlainData[] }

const createNode = (data: PlainData): DataNode => ({
	data,
	id: data.fsid,
	parent: data.parent,
	children: [],
})
