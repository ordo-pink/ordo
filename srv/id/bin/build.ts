// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { runBunCommand0, runCommand0 } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"
import { keysOf } from "@ordo-pink/tau"

const env = getc([
	"ID_USER_REPOSITORY",
	"ID_DYNAMODB_ENDPOINT",
	"ID_DYNAMODB_ACCESS_KEY",
	"ID_DYNAMODB_SECRET_KEY",
	"ID_DYNAMODB_REGION",
	"ID_PORT",
	"ID_ACCESS_TOKEN_EXPIRE_IN",
	"ID_REFRESH_TOKEN_EXPIRE_IN",
	"ID_ACCESS_TOKEN_PRIVATE_KEY_PATH",
	"ID_ACCESS_TOKEN_PUBLIC_KEY_PATH",
	"ID_REFRESH_TOKEN_PRIVATE_KEY_PATH",
	"ID_REFRESH_TOKEN_PUBLIC_KEY_PATH",
	"ID_USER_TABLE_NAME",
	"ID_TOKENS_TABLE_NAME",
	"ID_USER_FS_STRATEGY_PATH",
	"ID_TOKEN_FS_STRATEGY_PATH",
	"ID_EMAIL_API_KEY",
	"DT_INTERNAL_HOST",
	"WORKSPACE_HOST",
	"WEB_HOST",
])

const definitions = keysOf(env).reduce(
	(acc, key) => acc.concat(`--define Bun.env.${key}='${env[key]}' `),
	"",
)

runBunCommand0(`build srv/id/index.ts --outfile=id --compile ${definitions} --target=bun`, {
	stdout: "pipe",
	stderr: "pipe",
})
	.chain(() => runCommand0("mkdir -p var/out"))
	.chain(() => runCommand0("mv id var/out"))
	.orElse(console.error)
