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

import { BS_FOLDER_2_OPEN } from "@ordo-pink/frontend-icons"
import { create_function } from "@ordo-pink/core"

export default create_function(
	"pink.ordo.file-explorer",
	{
		queries: [
			"application.commands",
			"data.metadata_query",
			"data.content_query",
			"application.hosts",
			"application.fetch",
			"data.metadata_query",
		],
		commands: ["cmd.functions.activities.register"],
	},
	ctx => {
		const logger = ctx.get_logger()
		const commands = ctx.get_commands()

		logger.debug("🟡 Initialising file-explorer function...")

		commands.emit("cmd.functions.activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.file-explorer.activity",
				routes: ["/files", "/files/:fsid"],
				render_workspace: div => {
					div.innerHTML = "<div>Hi</div>"
				},
				render_icon: span => {
					span.innerHTML = BS_FOLDER_2_OPEN
				},
			},
		})

		logger.debug("🟢 Initialised file-explorer function.")
	},
)
