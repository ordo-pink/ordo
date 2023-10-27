// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Readable } from "stream"
import type { TDataCommands } from "@ordo-pink/data"
import { createServer } from "@ordo-pink/backend-utils"
import { ConsoleLogger, Logger } from "@ordo-pink/logger"
import { handleGetContent } from "./handlers/get-content.handler"
import { handleSetContent } from "./handlers/set-content.handler"
import { handleCreateData } from "./handlers/create-data.handler"
import { handleRemoveData } from "./handlers/remove-data.handler"
import { handleGetAllData } from "./handlers/get-all-data.handler"
import { handleUploadContent } from "./handlers/upload-content.handler"
import { handleUpdateData } from "./handlers/update-data.handler"

export type Params = {
	origin: string | string[]
	dataService: TDataCommands<Readable>
	idHost: string
	logger?: Logger
}

export const createDataServer = ({
	origin,
	dataService,
	idHost,
	logger = ConsoleLogger,
}: Params) => {
	return createServer({
		origin,
		logger,
		serverName: "dt",
		extendRouter: router =>
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
