// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createDirectoryIfNotExists0, mv0 } from "@ordo-pink/fs"
import { runBunCommand0 } from "@ordo-pink/binutil"
import { ConsoleLogger } from "@ordo-pink/logger"
import { keysOf } from "@ordo-pink/tau"
import { getc } from "@ordo-pink/getc"

const env = getc([
	"DT_PORT",
	"WORKSPACE_HOST",
	"WEB_HOST",
	"ID_HOST",
	"DT_DATA_S3_ACCESS_KEY",
	"DT_DATA_S3_SECRET_KEY",
	"DT_DATA_S3_REGION",
	"DT_DATA_S3_BUCKET_NAME",
	"DT_DATA_S3_ENDPOINT",
	"DT_CONTENT_S3_ACCESS_KEY",
	"DT_CONTENT_S3_SECRET_KEY",
	"DT_CONTENT_S3_REGION",
	"DT_CONTENT_S3_BUCKET_NAME",
	"DT_CONTENT_S3_ENDPOINT",
	"DT_DATA_PERSISTENCE_STRATEGY",
	"DT_CONTENT_PERSISTENCE_STRATEGY",
	"DT_DATA_PATH",
	"DT_CONTENT_PATH",
])

const defineEnv = (env: Record<string, string>) =>
	keysOf(env).reduce((acc, key) => acc.concat(`--define Bun.env.${key}='${env[key]}' `), "")
const createOutDirectoryIfNotExists0 = () => createDirectoryIfNotExists0("var/out")
const moveCompiledFileTooutDirectory0 = () => mv0("dt", "var/out/dt")

const command = `build srv/data/index.ts --outfile=dt --target=bun --minify --compile `
const envDefinitions = defineEnv(env)

runBunCommand0(command.concat(envDefinitions))
	.chain(createOutDirectoryIfNotExists0)
	.chain(moveCompiledFileTooutDirectory0)
	.orElse(ConsoleLogger.error)
