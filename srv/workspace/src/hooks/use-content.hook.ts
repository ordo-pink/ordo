// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { FSID } from "@ordo-pink/data"
import { useEffect } from "react"
import { useSubscription } from "./use-subscription"
import { content$ } from "$streams/data"
import { useSharedContext } from "@ordo-pink/core"

export const useContent = (fsid?: FSID) => {
	const { commands } = useSharedContext()
	const content = useSubscription(content$)

	useEffect(() => {
		fsid && commands.emit<cmd.data.getFileContent>("data.get-content", { fsid })

		return () => content$.next(null)
	}, [fsid, commands])

	return content
}
