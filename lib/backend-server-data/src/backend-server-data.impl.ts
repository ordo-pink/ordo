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

import type { Readable } from "stream"

import { ConsoleLogger, TLogger } from "@ordo-pink/logger"
import type { TDataCommands } from "@ordo-pink/managers"
import { create_koa_server } from "@ordo-pink/backend-utils"

import { handleCreateData } from "./handlers/create-data.handler"
import { handleGetAllData } from "./handlers/get-all-data.handler"
import { handleGetContent } from "./handlers/get-content.handler"
import { handleRemoveData } from "./handlers/remove-data.handler"
import { handleSetContent } from "./handlers/set-content.handler"
import { handleUpdateData } from "./handlers/update-data.handler"
import { handleUploadContent } from "./handlers/upload-content.handler"

export type Params = {
	origin: string | string[]
	dataService: TDataCommands<Readable>
	idHost: string
	logger?: TLogger
}

export const createDataServer = ({
	origin,
	dataService,
	idHost,
	logger = ConsoleLogger,
}: Params) => {
	return create_koa_server({
		origin,
		logger,
		server_name: "dt",
		extend_router: router =>
			router
				.get("/", handleGetAllData({ dataService, idHost }))
				.post("/:userId", handleCreateData({ dataService, idHost }))
				.delete("/:userId/:fsid", handleRemoveData({ dataService, idHost }))
				.get("/:userId/:fsid", handleGetContent({ dataService, idHost }))
				.put("/:userId/:fsid", handleUpdateData({ dataService, idHost }))
				.put("/:userId/:name/upload", handleUploadContent({ dataService, idHost }))
				.put("/:userId/:fsid/update", handleSetContent({ dataService, idHost })),
	})
}
