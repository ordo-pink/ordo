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
import { DataPersistenceStrategyFS } from "@ordo-pink/backend-persistence-strategy-data-fs"
import { ContentPersistenceStrategyFS } from "@ordo-pink/backend-persistence-strategy-content-fs"
import { Switch } from "@ordo-pink/switch"
import { Errors } from "@ordo-pink/rrr"

const main = () => {
	const coreEnvErrors = getEnvironmentStatus()
	const dataEnvErrors = getDataPersistenceEnvironmentStatus()
	const contentEnvErrors = getContentPersistenceEnvironmentStatus()

	if (coreEnvErrors || dataEnvErrors || contentEnvErrors) {
		coreEnvErrors && console.log(`Missing core env variable ${coreEnvErrors}`)
		dataEnvErrors && console.log(`Missing data env variable ${dataEnvErrors}`)
		contentEnvErrors && console.log(`Missing content env variable ${contentEnvErrors}`)

		process.exit(1)
	}

	const port = Number(Bun.env.DT_PORT!)
	const dataPersistenceStrategy = getDataPersistenceStrategy()
	const contentPersistenceStrategy = getContentPersistenceStrategy()

	const app = createDataServer({
		dataService: DataCommands.of({ dataPersistenceStrategy, contentPersistenceStrategy }),
		idHost: Bun.env.ID_INTERNAL_HOST!,
		origin: Bun.env.WORKSPACE_PUBLIC_HOST!,
		logger: ConsoleLogger,
	})

	app.listen(port, () => {
		ConsoleLogger.info(`DT server running on http://localhost:${port}`)
	})
}

main()

// --- Internal ---

const getDataPersistenceStrategy = () =>
	Switch.of(Bun.env.DT_DATA_PERSISTENCE_STRATEGY)
		.case("s3", () =>
			DataPersistenceStrategyS3.of({
				accessKeyId: Bun.env.DT_DATA_PERSISTENCE_STRATEGY_S3_ACCESS_KEY!,
				bucketName: Bun.env.DT_PERSISTENCE_STRATEGY_S3_DATA_BUCKET_NAME!,
				region: Bun.env.DT_PERSISTENCE_STRATEGY_S3_REGION!,
				secretAccessKey: Bun.env.DT_PERSISTENCE_STRATEGY_S3_SECRET_KEY!,
				endpoint: Bun.env.DT_PERSISTENCE_STRATEGY_S3_ENDPOINT!,
			}),
		)
		.default(() =>
			DataPersistenceStrategyFS.of({ root: Bun.env.DT_DATA_PERSISTENCE_STRATEGY_FS_PATH! }),
		)

const getContentPersistenceStrategy = () =>
	Switch.of(Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY)
		.case("s3", () =>
			ContentPersistenceStrategyS3.of({
				accessKeyId: Bun.env.DT_DATA_PERSISTENCE_STRATEGY_S3_ACCESS_KEY!,
				bucketName: Bun.env.DT_PERSISTENCE_STRATEGY_S3_CONTENT_BUCKET_NAME!,
				region: Bun.env.DT_PERSISTENCE_STRATEGY_S3_SECRET_KEY!,
				secretAccessKey: Bun.env.DT_PERSISTENCE_STRATEGY_S3_SECRET_KEY!,
				endpoint: Bun.env.DT_PERSISTENCE_STRATEGY_S3_ENDPOINT!,
			}),
		)
		.default(() =>
			ContentPersistenceStrategyFS.of({ root: Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY_FS_PATH! }),
		)

const requiredEnvironmentVariables = [
	"DT_PORT",
	"DT_INTERNAL_HOST",
	"DT_DATA_PERSISTENCE_STRATEGY",
	"DT_CONTENT_PERSISTENCE_STRATEGY",
	"ID_INTERNAL_HOST",
	"WEB_PUBLIC_HOST",
	"WORKSPACE_PUBLIC_HOST",
	"DT_DATA_PERSISTENCE_STRATEGY_S3_ACCESS_KEY",
	"DT_DATA_PERSISTENCE_STRATEGY_S3_SECRET_KEY",
	"DT_DATA_PERSISTENCE_STRATEGY_S3_REGION",
	"DT_DATA_PERSISTENCE_STRATEGY_S3_BUCKET_NAME",
	"DT_DATA_PERSISTENCE_STRATEGY_S3_ENDPOINT",
	"DT_DATA_PERSISTENCE_STRATEGY_FS_PATH",
	"DT_CONTENT_PERSISTENCE_STRATEGY_S3_ACCESS_KEY",
	"DT_CONTENT_PERSISTENCE_STRATEGY_S3_SECRET_KEY",
	"DT_CONTENT_PERSISTENCE_STRATEGY_S3_REGION",
	"DT_CONTENT_PERSISTENCE_STRATEGY_S3_BUCKET_NAME",
	"DT_CONTENT_PERSISTENCE_STRATEGY_S3_ENDPOINT",
	"DT_CONTENT_PERSISTENCE_STRATEGY_FS_PATH",
] as const

type RequiredEnvKey = (typeof requiredEnvironmentVariables)[number]

const errors = Errors(
	requiredEnvironmentVariables.reduce(
		(acc, key) => ({ ...acc, [key]: key }),
		{} as { [K in RequiredEnvKey]: K },
	),
)

const getEnvironmentStatus = () =>
	Switch.empty()
		.case(!Bun.env.DT_PORT, errors.DT_PORT)
		.case(!Bun.env.WEB_PUBLIC_HOST, errors.WEB_PUBLIC_HOST)
		.case(!Bun.env.WORKSPACE_PUBLIC_HOST, errors.WORKSPACE_PUBLIC_HOST)
		.case(!Bun.env.ID_INTERNAL_HOST, errors.ID_INTERNAL_HOST)
		.case(!Bun.env.DT_INTERNAL_HOST, errors.DT_INTERNAL_HOST)
		.case(!Bun.env.DT_DATA_PERSISTENCE_STRATEGY, errors.DT_DATA_PERSISTENCE_STRATEGY)
		.case(!Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY, errors.DT_CONTENT_PERSISTENCE_STRATEGY)
		.default(() => null)

const getDataPersistenceEnvironmentStatus = () =>
	Switch.empty()
		.case(!Bun.env.DT_DATA_PERSISTENCE_STRATEGY, errors.DT_DATA_PERSISTENCE_STRATEGY)
		.default(() =>
			Switch.of(Bun.env.DT_DATA_PERSISTENCE_STRATEGY!)
				.case("s3", () =>
					Switch.empty()
						.case(
							!Bun.env.DT_DATA_PERSISTENCE_STRATEGY_S3_ACCESS_KEY,
							errors.DT_DATA_PERSISTENCE_STRATEGY_S3_ACCESS_KEY,
						)
						.case(
							!Bun.env.DT_DATA_PERSISTENCE_STRATEGY_S3_SECRET_KEY,
							errors.DT_DATA_PERSISTENCE_STRATEGY_S3_SECRET_KEY,
						)
						.case(
							!Bun.env.DT_DATA_PERSISTENCE_STRATEGY_S3_REGION,
							errors.DT_DATA_PERSISTENCE_STRATEGY_S3_REGION,
						)
						.case(
							!Bun.env.DT_DATA_PERSISTENCE_STRATEGY_S3_BUCKET_NAME,
							errors.DT_DATA_PERSISTENCE_STRATEGY_S3_BUCKET_NAME,
						)
						.case(
							!Bun.env.DT_DATA_PERSISTENCE_STRATEGY_S3_ENDPOINT,
							errors.DT_DATA_PERSISTENCE_STRATEGY_S3_ENDPOINT,
						)
						.default(() => null),
				)
				.default(() =>
					Switch.empty()
						.case(
							!Bun.env.DT_DATA_PERSISTENCE_STRATEGY_FS_PATH,
							errors.DT_DATA_PERSISTENCE_STRATEGY_FS_PATH,
						)
						.default(() => null),
				),
		)

const getContentPersistenceEnvironmentStatus = () =>
	Switch.empty()
		.case(!Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY, errors.DT_CONTENT_PERSISTENCE_STRATEGY)
		.default(() =>
			Switch.of(Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY!)
				.case("s3", () =>
					Switch.empty()
						.case(
							!Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY_S3_ACCESS_KEY,
							errors.DT_CONTENT_PERSISTENCE_STRATEGY_S3_ACCESS_KEY,
						)
						.case(
							!Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY_S3_SECRET_KEY,
							errors.DT_CONTENT_PERSISTENCE_STRATEGY_S3_SECRET_KEY,
						)
						.case(
							!Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY_S3_REGION,
							errors.DT_CONTENT_PERSISTENCE_STRATEGY_S3_REGION,
						)
						.case(
							!Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY_S3_BUCKET_NAME,
							errors.DT_CONTENT_PERSISTENCE_STRATEGY_S3_BUCKET_NAME,
						)
						.case(
							!Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY_S3_ENDPOINT,
							errors.DT_CONTENT_PERSISTENCE_STRATEGY_S3_ENDPOINT,
						)
						.default(() => null),
				)
				.default(() =>
					Switch.empty()
						.case(
							!Bun.env.DT_CONTENT_PERSISTENCE_STRATEGY_FS_PATH,
							errors.DT_CONTENT_PERSISTENCE_STRATEGY_FS_PATH,
						)
						.default(() => null),
				),
		)
