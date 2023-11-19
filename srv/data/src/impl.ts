// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createDataServer } from "@ordo-pink/backend-server-data"
import { getc } from "@ordo-pink/getc"
import { ContentPersistenceStrategyFS } from "@ordo-pink/backend-content-persistence-strategy-fs"
import { DataPersistenceStrategyFS } from "@ordo-pink/backend-data-persistence-strategy-fs"
import { ConsoleLogger } from "@ordo-pink/logger"
import { DataCommands } from "@ordo-pink/data"
import { ContentPersistenceStrategyS3 } from "@ordo-pink/backend-content-persistence-strategy-s3"

const {
	// DATA_DATA_PATH,
	DATA_HOST,
	DATA_METADATA_PATH,
	DATA_PORT,
	WORKSPACE_HOST,
	WEB_HOST,
	ID_HOST,
	DATA_S3_ACCESS_KEY,
	DATA_S3_SECRET_KEY,
	DATA_S3_REGION,
	DATA_S3_BUCKET_NAME,
	DATA_S3_ENDPOINT,
} = getc([
	// "DATA_DATA_PATH",
	"DATA_METADATA_PATH",
	"DATA_PORT",
	"DATA_HOST",
	"WORKSPACE_HOST",
	"ID_HOST",
	"WEB_HOST",
	"DATA_S3_ACCESS_KEY",
	"DATA_S3_SECRET_KEY",
	"DATA_S3_REGION",
	"DATA_S3_BUCKET_NAME",
	"DATA_S3_ENDPOINT",
])

const main = async () => {
	const dataRepository = DataPersistenceStrategyFS.of({ root: DATA_METADATA_PATH })
	// const contentRepository = ContentPersistenceStrategyFS.of({ root: DATA_DATA_PATH })
	const contentRepository = ContentPersistenceStrategyS3.of({
		accessKeyId: DATA_S3_ACCESS_KEY,
		secretAccessKey: DATA_S3_SECRET_KEY,
		region: DATA_S3_REGION,
		bucketName: DATA_S3_BUCKET_NAME,
		endpoint: DATA_S3_ENDPOINT,
	})
	const dataService = DataCommands.of({
		dataPersistenceStrategy: dataRepository,
		contentPersistenceStrategy: contentRepository,
	})

	const app = createDataServer({
		dataService,
		idHost: ID_HOST,
		origin: [WORKSPACE_HOST, WEB_HOST],
		logger: ConsoleLogger,
	})

	ConsoleLogger.info(`DATA server running on ${DATA_HOST}`)

	app.listen({ port: Number(DATA_PORT) })
}

main()
