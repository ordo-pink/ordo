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

// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

import { BsFileEarmarkCode } from "react-icons/bs"
import { lazy } from "react"

import { ORDO_PINK_EXCALIDRAW_FUNCTION } from "@ordo-pink/core"
import { createFunction } from "@ordo-pink/frontend-create-function"

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

export default createFunction(
	ORDO_PINK_EXCALIDRAW_FUNCTION,
	{ queries: [], commands: [] },
	({ getCommands, getLogger }) => {
		const logger = getLogger()
		const commands = getCommands()

		logger.debug("Initialising...")

		// TODO: Move from editor to extensions
		// TODO: Rename extensions to functions
		commands.emit<cmd.editor.registerFileAssociation>("editor.register-file-association", {
			content_type: "application/excalidraw",
			name: ORDO_PINK_EXCALIDRAW_FUNCTION.concat(".excalidraw-editor"),
			Icon: BsFileEarmarkCode,
			Component: lazy(() => import("./src/components/excalidraw.component")),
		})

		logger.debug("Initialised.")
	},
)
