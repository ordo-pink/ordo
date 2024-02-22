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

import { ORDO_PINK_EDITOR_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"
import { registerEditorActivity } from "./src/activities/editor.activity"
import { registerGoToEditorCommand } from "./src/commands/go-to-editor.command"
import { registerOpenInEditorCommand } from "./src/commands/open-in-editor.command"

export default createFunction(
	ORDO_PINK_EDITOR_FUNCTION,
	{ commands: [], queries: [] },
	({ getCommands, getLogger, data }) => {
		const commands = getCommands()
		const logger = getLogger()

		logger.debug("Initialising...")

		const dropEditorActivity = registerEditorActivity({ commands })
		const dropGoToEditorCmd = registerGoToEditorCommand({ commands })
		const dropOpenInEditorCmd = registerOpenInEditorCommand({ commands, data })

		logger.debug("Initialised.")

		return () => {
			logger.debug("Terminating...")

			dropEditorActivity()
			dropGoToEditorCmd()
			dropOpenInEditorCmd()

			logger.debug("Terminated.")
		}
	},
)
