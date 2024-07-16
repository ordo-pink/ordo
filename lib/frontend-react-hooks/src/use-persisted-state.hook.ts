import { useEffect, useState } from "react"

import { chainE, fromNullableE, mapE } from "@ordo-pink/either"
import { type FSID } from "@ordo-pink/data"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { LIB_DIRECTORY_FSID } from "@ordo-pink/core"
import { useCurrentFID } from "@ordo-pink/frontend-stream-activities"

import { useChildren } from "./use-data.hook"
import { useCommands } from "./use-commands.hook"
import { useContent } from "./use-content.hook"

export const usePersistedState = () => {
	const fid = useCurrentFID()
	const [extensionFsid, setExtensionFsid] = useState<FSID>()

	const commands = useCommands()

	const children = useChildren(LIB_DIRECTORY_FSID, true)
	const content = useContent(extensionFsid)

	useEffect(() => {
		fromNullableE(KnownFunctions.exchange(fid))
			.pipe(
				chainE(extension =>
					fromNullableE(children.find(child => child.name === `${extension}.json`)),
				),
			)
			.pipe(mapE(extensionData => setExtensionFsid(extensionData.fsid)))
	}, [fid, children])

	useEffect(() => {
		fromNullableE(extensionFsid).pipe(
			mapE(fsid => commands.emit<cmd.data.get_content>("data.content.get_content", fsid)),
		)
	}, [extensionFsid, commands])

	return content
}
