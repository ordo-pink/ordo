import { PlainData } from "@ordo-pink/data"
import { data$ } from "@ordo-pink/frontend-stream-data"

import { useStrictSubscription } from "./use-strict-subscription.hook"

export const useChildren = () => {
	return [] as PlainData[]
}

export const useData = () => {
	const data = useStrictSubscription(data$, [])

	console.log(data)

	return data
}

export const useParentChain = () => {
	return [] as PlainData[]
}

export const useDataByFSID = () => {
	return null
}

export const useDataByName = () => {
	return null
}

export const useSelectDataList = () => {
	return []
}

export const useSelectData = () => {
	return null
}
