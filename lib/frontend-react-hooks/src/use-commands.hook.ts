import { useMemo } from "react"

import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { useCurrentFID } from "@ordo-pink/frontend-stream-activities"

/**
 * A React hook for accessing commands.
 * // TODO: Move all hooks to frontend-react-hooks
 */
export const useCommands = () => {
	const fid = useCurrentFID()
	const commands = useMemo(() => getCommands(fid), [fid])

	return commands
}
