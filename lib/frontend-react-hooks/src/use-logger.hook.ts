import { useMemo } from "react"

import { type Logger } from "@ordo-pink/logger"
import { getLogger } from "@ordo-pink/frontend-logger"
import { useCurrentFID } from "@ordo-pink/frontend-stream-activities"

export const useLogger = (): Logger => {
	const fid = useCurrentFID()
	const logger = useMemo(() => getLogger(fid), [fid])

	return logger
}
