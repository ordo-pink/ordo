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
import { handleCreate } from "./handlers/create.handler"
import { handleRemove } from "./handlers/remove.handler"
import { handleRename } from "./handlers/rename.handler"
import { handleUnlink } from "./handlers/unlink.handler"
import { handleFetch } from "./handlers/fetch.handler"
import { handleMove } from "./handlers/move.handler"
import { handleLink } from "./handlers/link.handler"
import { handleUpload } from "./handlers/upload.handler"

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
				.get("/", handleFetch({ dataService, idHost }))
				.post("/:userId", handleCreate({ dataService, idHost }))
				.delete("/:userId/:fsid", handleRemove({ dataService, idHost }))
				.get("/:userId/:fsid", handleGetContent({ dataService, idHost }))
				.put("/:userId/:name/upload", handleUpload({ dataService, idHost }))
				.put("/:userId/:fsid/update", handleSetContent({ dataService, idHost }))
				.patch("/:userId/:fsid/move", handleMove({ dataService, idHost }))
				.patch("/:userId/:fsid/link", handleLink({ dataService, idHost }))
				.patch("/:userId/:fsid/unlink", handleUnlink({ dataService, idHost }))
				.patch("/:userId/:fsid/rename", handleRename({ dataService, idHost })),
	})
}
