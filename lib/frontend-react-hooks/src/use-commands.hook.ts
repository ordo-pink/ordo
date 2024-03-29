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
