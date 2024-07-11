// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { createDirectoryIfNotExists0, mv0 } from "@ordo-pink/fs"
import { die, runBunCommand0 } from "@ordo-pink/binutil"
import { Oath } from "@ordo-pink/oath"
import { getc } from "@ordo-pink/getc"
import { keys_of } from "@ordo-pink/tau"

const env = getc()

const defineEnv = (env: Record<string, string>) =>
	keys_of(env).reduce((acc, key) => acc.concat(`--define Bun.env.${key}='${env[key]}' `), "")
const createOutDirectoryIfNotExists0 = () => createDirectoryIfNotExists0("var/out")
const moveCompiledFileToOutDirectory0 = () => mv0("id", "var/out/id")

const command = "build srv/id/index.ts --outfile=id --compile "
const envDefinitions = defineEnv(env)

void Oath.of(command.concat(envDefinitions))
	.chain(runBunCommand0)
	.chain(createOutDirectoryIfNotExists0)
	.chain(moveCompiledFileToOutDirectory0)
	.orElse(die())
