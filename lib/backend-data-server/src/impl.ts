// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import type { Readable } from "stream"
import type { TDataService } from "@ordo-pink/backend-data-service"
import { createServer } from "@ordo-pink/backend-utils"
import { ConsoleLogger, Logger } from "@ordo-pink/logger"
import { handleUpdateFileContent } from "./handlers/update-file-content.handler"
import { handleCreateDirectory } from "./handlers/create-directory.handler"
import { handleRemoveDirectory } from "./handlers/remove-directory.handler"
import { handleUpdateDirectory } from "./handlers/update-directory.handler"
import { handleGetDirectory } from "./handlers/get-directory.handler"
import { handleCreateFile } from "./handlers/create-file.handler"
import { handleRemoveFile } from "./handlers/remove-file.handler"
import { handleUpdateFile } from "./handlers/update-file.handler"
import { handleGetFile } from "./handlers/get-file.handler"
import { handleGetRoot } from "./handlers/get-root.handler"

// TODO: Audit
export type Params = {
	origin: string | string[]
	dataService: TDataService<Readable>
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
		extendRouter: r =>
			r
				.post("/directories/:userId", handleCreateDirectory({ dataService, idHost }))
				.get("/directories/:userId", handleGetRoot({ dataService, idHost }))
				.get("/directories/:userId/:path*", handleGetDirectory({ dataService, idHost }))
				.patch("/directories/:userId/:path*", handleUpdateDirectory({ dataService, idHost }))
				.delete("/directories/:userId/:path*", handleRemoveDirectory({ dataService, idHost }))
				.post("/files/:userId", handleCreateFile({ dataService, idHost }))
				.get("/files/:userId/:path*", handleGetFile({ dataService, idHost }))
				.patch("/files/:userId/:path*", handleUpdateFile({ dataService, idHost }))
				.put("/files/:userId/:path*", handleUpdateFileContent({ dataService, idHost }))
				.delete("/files/:userId/:path*", handleRemoveFile({ dataService, idHost })),
	})
}
