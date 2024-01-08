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

const env = getc()

const defineEnv = (env: Record<string, string>) =>
	keysOf(env).reduce((acc, key) => acc.concat(`--define Bun.env.${key}='${env[key]}' `), "")
const createOutDirectoryIfNotExists0 = () => createDirectoryIfNotExists0("var/out")
const moveCompiledFileToOutDirectory0 = () => mv0("dt", "var/out/dt")

const command = `build srv/data/index.ts --outfile=dt --target=bun --minify --compile `
const envDefinitions = defineEnv(env)

runBunCommand0(command.concat(envDefinitions))
	.chain(createOutDirectoryIfNotExists0)
	.chain(moveCompiledFileToOutDirectory0)
	.orElse(ConsoleLogger.error)
