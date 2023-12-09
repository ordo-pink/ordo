// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { runBunCommand0, runCommand0 } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"
import { keysOf } from "@ordo-pink/tau"

const env = getc([
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
])

const definitions = keysOf(env).reduce(
	(acc, key) => acc.concat(`--define Bun.env.${key}='${env[key]}' `),
	"",
)

runBunCommand0(`build srv/data/index.ts --outfile=dt --compile ${definitions} --target=bun`, {
	stdout: "pipe",
	stderr: "pipe",
})
	.chain(() => runCommand0("mkdir -p var/out"))
	.chain(() => runCommand0("mv dt var/out"))
	.orElse(console.error)
