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

import { BsFileEarmarkRichtext, BsLayoutSidebar } from "react-icons/bs"
import { lazy } from "react"

import { ORDO_PINK_EDITOR_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"

import { registerGoToEditorCommand } from "./src/commands/go-to-editor.command"
import { registerOpenInEditorCommand } from "./src/commands/open-in-editor.command"

export default createFunction(
	ORDO_PINK_EDITOR_FUNCTION,
	{ commands: [], queries: [] },
	({ getCommands, getLogger, registerActivity, data }) => {
		const commands = getCommands()
		const logger = getLogger()

		logger.debug("Initialising...")

		const unregisterActivity = registerActivity({
			Component: lazy(() => import("./src/views/editor.workspace")),
			Sidebar: lazy(() => import("./src/views/editor.sidebar")),
			Icon: BsLayoutSidebar,
			name: ORDO_PINK_EDITOR_FUNCTION.concat(".activities.editor"),
			routes: ["/editor", "/editor/:fsid"],
			is_background: false,
		})

		const dropGoToEditorCmd = registerGoToEditorCommand({ commands })
		const dropOpenInEditorCmd = registerOpenInEditorCommand({ commands, data })

		commands.emit<cmd.editor.registerFileAssociation>("editor.register-file-association", {
			Component: lazy(() => import("./src/components/editor.component")),
			Icon: BsFileEarmarkRichtext,
			content_type: "text/ordo",
			name: ORDO_PINK_EDITOR_FUNCTION.concat(".ordo-editor"),
		})

		logger.debug("Initialised.")

		return () => {
			logger.debug("Terminating...")

			unregisterActivity()

			dropGoToEditorCmd()
			dropOpenInEditorCmd()

			logger.debug("Terminated.")
		}
	},
)
