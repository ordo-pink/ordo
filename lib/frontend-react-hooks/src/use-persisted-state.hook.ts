// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
