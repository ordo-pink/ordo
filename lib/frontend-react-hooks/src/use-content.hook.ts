import { useEffect } from "react"

import { FSID } from "@ordo-pink/data"
import { content$ } from "@ordo-pink/frontend-stream-data"

import { useCommands } from "./use-commands.hook"
import { useSubscription } from "./use-subscription.hook"

export const useContent = (fsid?: FSID) => {
	const commands = useCommands()
	const content = useSubscription(content$)

	useEffect(() => {
		if (!fsid) return content$.next(null)

		commands.emit<cmd.data.getFileContent>("data.get-content", { fsid })

		return () => void content$.next(null)
	}, [fsid, commands])

	return content
}
