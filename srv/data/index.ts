// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createDataServer } from "@ordo-pink/backend-server-data"
import { ConsoleLogger } from "@ordo-pink/logger"
import { DataCommands } from "@ordo-pink/data"
import { ContentPersistenceStrategyS3 } from "@ordo-pink/backend-persistence-strategy-content-s3"
import { DataPersistenceStrategyS3 } from "@ordo-pink/backend-persistence-strategy-data-s3"
import { Switch } from "@ordo-pink/switch"
import { DataPersistenceStrategyFS } from "@ordo-pink/backend-persistence-strategy-data-fs"
import { ContentPersistenceStrategyFS } from "@ordo-pink/backend-persistence-strategy-content-fs"
import chalk from "chalk"

const port = Bun.env.DT_PORT!
const idHost = Bun.env.ID_HOST!
const origin = [Bun.env.WORKSPACE_HOST!, Bun.env.WEB_HOST!]
const logger = ConsoleLogger
const contentPersistenceStrategyType = Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY!

const dataPersistenceStrategyType = Bun.env.DT_DATA_PERSISTENCE_STRATEGY!

const dataPersistenceStrategyFSParams = {
	root: Bun.env.DT_DATA_PATH!,
}

const dataPersistenceStrategyS3Params = {
	accessKeyId: Bun.env.DT_DATA_S3_ACCESS_KEY!,
	secretAccessKey: Bun.env.DT_DATA_S3_SECRET_KEY!,
	region: Bun.env.DT_DATA_S3_REGION!,
	endpoint: Bun.env.DT_DATA_S3_ENDPOINT!,
	bucketName: Bun.env.DT_DATA_S3_BUCKET_NAME!,
}

const contentPersistenceStrategyFSParams = {
	root: Bun.env.DT_CONTENT_PATH!,
}

const contentPersistenceStrategyS3Params = {
	accessKeyId: Bun.env.DT_CONTENT_S3_ACCESS_KEY!,
	secretAccessKey: Bun.env.DT_CONTENT_S3_SECRET_KEY!,
	region: Bun.env.DT_CONTENT_S3_REGION!,
	endpoint: Bun.env.DT_CONTENT_S3_ENDPOINT!,
	bucketName: Bun.env.DT_CONTENT_S3_BUCKET_NAME!,
}

const main = () => {
	const dataPersistenceStrategy = Switch.of(dataPersistenceStrategyType)
		.case("s3", () => DataPersistenceStrategyS3.of(dataPersistenceStrategyS3Params))
		.default(() => DataPersistenceStrategyFS.of(dataPersistenceStrategyFSParams))

	const contentPersistenceStrategy = Switch.of(contentPersistenceStrategyType)
		.case("s3", () => ContentPersistenceStrategyS3.of(contentPersistenceStrategyS3Params))
		.default(() => ContentPersistenceStrategyFS.of(contentPersistenceStrategyFSParams))

	const dataService = DataCommands.of({ dataPersistenceStrategy, contentPersistenceStrategy })

	createDataServer({ dataService, idHost, origin, logger }).listen({ port: Number(port) }, () =>
		ConsoleLogger.info(`DT running on http://localhost:${chalk.blue(port)}`),
	)
}

main()
