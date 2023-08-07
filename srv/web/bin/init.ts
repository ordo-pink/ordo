// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import "#std/dotenv/load.ts"

import { Oath } from "#lib/oath/mod.ts"
import { createDirectoryIfNotExists } from "#lib/fs/mod.ts"
import { getc } from "#lib/getc/mod.ts"

const { WEB_STATIC_ROOT } = getc(["WEB_STATIC_ROOT"])

await Oath.fromNullable(WEB_STATIC_ROOT).chain(createDirectoryIfNotExists).toPromise()
