import { FSID } from "@ordo-pink/data"
import { useEffect } from "react"
import { useSubscription } from "./use-subscription"
import { content$ } from "$streams/data"
import { useSharedContext } from "@ordo-pink/frontend-core"

export const useContent = (fsid?: FSID) => {
	const { commands } = useSharedContext()
	const content = useSubscription(content$)

	useEffect(() => {
		fsid && commands.emit<cmd.data.getFileContent>("data.get-content", { fsid })

		return () => content$.next(null)
	}, [fsid])

	return content
}
