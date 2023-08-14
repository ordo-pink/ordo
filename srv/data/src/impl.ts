// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createDataServer } from "#lib/backend-data-server/mod.ts"
import { getc } from "#lib/getc/mod.ts"
import { BackendDataService } from "#lib/backend-data-service/mod.ts"
import { FSMetadataRepository } from "#lib/backend-fs-metadata-repository/mod.ts"
import { FSDataRepository } from "#lib/backend-fs-data-repository/mod.ts"
import { ConsoleLogger } from "#lib/logger/mod.ts"

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
	"DATA_ACCESS_CONTROL_ALLOW_ORIGIN",
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
