/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import chalk from "chalk"

import { ConsoleLogger } from "@ordo-pink/logger"
import { ContentPersistenceStrategyFS } from "@ordo-pink/backend-persistence-strategy-content-fs"
import { ContentPersistenceStrategyS3 } from "@ordo-pink/backend-persistence-strategy-content-s3"
import { DataCommands } from "@ordo-pink/managers"
import { DataPersistenceStrategyFS } from "@ordo-pink/backend-persistence-strategy-data-fs"
import { DataPersistenceStrategyS3 } from "@ordo-pink/backend-persistence-strategy-data-s3"
import { Switch } from "@ordo-pink/switch"
import { createDataServer } from "@ordo-pink/backend-server-data"

const port = Bun.env.ORDO_DT_PORT!
const idHost = Bun.env.ORDO_ID_HOST!
const origin = [Bun.env.ORDO_WORKSPACE_HOST!, Bun.env.ORDO_WEB_HOST!]
const logger = ConsoleLogger
const contentPersistenceStrategyType = Bun.env.ORDO_DT_CONTENT_PERSISTENCE_STRATEGY!

const dataPersistenceStrategyType = Bun.env.ORDO_DT_DATA_PERSISTENCE_STRATEGY!

const dataPersistenceStrategyFSParams = {
	root: Bun.env.ORDO_DT_DATA_PATH!,
}

const dataPersistenceStrategyS3Params = {
	accessKeyId: Bun.env.ORDO_DT_DATA_S3_ACCESS_KEY!,
	secretAccessKey: Bun.env.ORDO_DT_DATA_S3_SECRET_KEY!,
	region: Bun.env.ORDO_DT_DATA_S3_REGION!,
	endpoint: Bun.env.ORDO_DT_DATA_S3_ENDPOINT!,
	bucketName: Bun.env.ORDO_DT_DATA_S3_BUCKET_NAME!,
}

const contentPersistenceStrategyFSParams = {
	root: Bun.env.ORDO_DT_CONTENT_PATH!,
}

const contentPersistenceStrategyS3Params = {
	accessKeyId: Bun.env.ORDO_DT_CONTENT_S3_ACCESS_KEY!,
	secretAccessKey: Bun.env.ORDO_DT_CONTENT_S3_SECRET_KEY!,
	region: Bun.env.ORDO_DT_CONTENT_S3_REGION!,
	endpoint: Bun.env.ORDO_DT_CONTENT_S3_ENDPOINT!,
	bucketName: Bun.env.ORDO_DT_CONTENT_S3_BUCKET_NAME!,
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
