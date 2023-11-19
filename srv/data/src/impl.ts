// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createDataServer } from "@ordo-pink/backend-server-data"
import { getc } from "@ordo-pink/getc"
import { ConsoleLogger } from "@ordo-pink/logger"
import { DataCommands } from "@ordo-pink/data"
import { ContentPersistenceStrategyS3 } from "@ordo-pink/backend-content-persistence-strategy-s3"
import { DataPersistenceStrategyS3 } from "@ordo-pink/backend-data-persistence-strategy-s3"

const {
	DATA_HOST,
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
	const idHost = ID_HOST
	const origin = [WORKSPACE_HOST, WEB_HOST]
	const logger = ConsoleLogger
	const accessKeyId = DATA_S3_ACCESS_KEY
	const secretAccessKey = DATA_S3_SECRET_KEY
	const region = DATA_S3_REGION
	const bucketName = DATA_S3_BUCKET_NAME
	const endpoint = DATA_S3_ENDPOINT

	const awsS3Params = { accessKeyId, secretAccessKey, region, bucketName, endpoint }

	const dataPersistenceStrategy = DataPersistenceStrategyS3.of(awsS3Params)
	const contentPersistenceStrategy = ContentPersistenceStrategyS3.of(awsS3Params)
	const dataService = DataCommands.of({ dataPersistenceStrategy, contentPersistenceStrategy })

	const app = createDataServer({ dataService, idHost, origin, logger })

	ConsoleLogger.info(`DATA server running on ${DATA_HOST}`)

	app.listen({ port: Number(DATA_PORT) })
}

main()
