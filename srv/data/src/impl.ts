// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createDataServer } from "@ordo-pink/backend-data-server"
import { getc } from "@ordo-pink/getc"
import { BackendDataService } from "@ordo-pink/backend-data-service"
import { FSMetadataRepository } from "@ordo-pink/backend-fs-metadata-repository"
import { FSDataRepository } from "@ordo-pink/backend-fs-data-repository"
import { ConsoleLogger } from "@ordo-pink/logger"

const {
	DATA_DATA_PATH,
	DATA_HOST,
	DATA_METADATA_PATH,
	DATA_PORT,
	WORKSPACE_HOST,
	WEB_HOST,
	ID_HOST,
} = getc([
	"DATA_DATA_PATH",
	"DATA_METADATA_PATH",
	"DATA_PORT",
	"DATA_HOST",
	"WORKSPACE_HOST",
	"ID_HOST",
	"WEB_HOST",
])

const metadataRepository = FSMetadataRepository.of({ root: DATA_METADATA_PATH })
const dataRepository = FSDataRepository.of({ root: DATA_DATA_PATH })
const dataService = BackendDataService.of({ dataRepository, metadataRepository })

const app = createDataServer({
	dataService,
	idHost: ID_HOST,
	origin: [WORKSPACE_HOST, WEB_HOST],
	logger: ConsoleLogger,
})

ConsoleLogger.info(`DATA server running on ${DATA_HOST}`)

await app.listen({ port: Number(DATA_PORT) })
