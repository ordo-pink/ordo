// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { runBunCommand0, runCommand0 } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"
import { keysOf } from "@ordo-pink/tau"

const env = getc([
	"DATA_PORT",
	"DATA_HOST",
	"WORKSPACE_HOST",
	"ID_HOST",
	"WEB_HOST",
	"DATA_INTERNAL_HOST",
	"DATA_S3_ACCESS_KEY",
	"DATA_S3_SECRET_KEY",
	"DATA_S3_REGION",
	"DATA_S3_CONTENT_BUCKET_NAME",
	"DATA_S3_DATA_BUCKET_NAME",
	"DATA_S3_ENDPOINT",
])

const definitions = keysOf(env).reduce(
	(acc, key) => acc.concat(`--define Bun.env.${key}='${env[key]}' `),
	"",
)

runBunCommand0(`build srv/data/index.ts --outfile=dt.js ${definitions} --target=bun`, {
	stdout: "pipe",
	stderr: "pipe",
})
	// .chain(() => runCommand0("mkdir -p var/out"))
	// .chain(() => runCommand0("mv dt var/out"))
	.orElse(console.error)
