// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Application } from "#x/oak@v12.6.0/mod.ts"
import { createServer } from "#lib/backend-utils/mod.ts"
import { ConsoleLogger, Logger } from "#lib/logger/mod.ts"
import { TDataService } from "#lib/backend-data-service/mod.ts"
import { handleUpdateFileContent } from "./handlers/update-file-content.handler.ts"
import { handleCreateDirectory } from "./handlers/create-directory.handler.ts"
import { handleRemoveDirectory } from "./handlers/remove-directory.handler.ts"
import { handleUpdateDirectory } from "./handlers/update-directory.handler.ts"
import { handleGetDirectory } from "./handlers/get-directory.handler.ts"
import { handleCreateFile } from "./handlers/create-file.handler.ts"
import { handleRemoveFile } from "./handlers/remove-file.handler.ts"
import { handleUpdateFile } from "./handlers/update-file.handler.ts"
import { handleGetFile } from "./handlers/get-file.handler.ts"
import { handleGetRoot } from "./handlers/get-root.handler.ts"

// TODO: Audit
export type Params = {
	origin: string | string[]
	dataService: TDataService<ReadableStream>
	idHost: string
	logger?: Logger
}

export type Fn = (params: Params) => Application

export const createDataServer: Fn = ({ origin, dataService, idHost, logger = ConsoleLogger }) => {
	return createServer({
		origin,
		logger,
		serverName: "data-server",
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
