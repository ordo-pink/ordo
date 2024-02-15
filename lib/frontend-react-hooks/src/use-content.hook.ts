import { useEffect } from "react"

import { FSID } from "@ordo-pink/data"
import { content$ } from "@ordo-pink/frontend-stream-data"

import { useCommands } from "./use-commands.hook"
import { useDataByFSID } from "./use-data.hook"
import { useStrictSubscription } from "./use-strict-subscription.hook"

export const useContent = (fsid?: FSID) => {
	const commands = useCommands()
	const content = useStrictSubscription(content$, {})
	const data = useDataByFSID(fsid)

	useEffect(() => {
		if (!data) return

		commands.emit<cmd.data.getContent>("data.get-content", data.fsid)

		return () => {
			commands.emit<cmd.data.dropContent>("data.drop-content", data.fsid)
		}
	}, [commands, data])

	return fsid ? content[fsid] : null
}
