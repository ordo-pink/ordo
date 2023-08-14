// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { runCommand } from "#lib/binutil/mod.ts"
import { getc } from "#lib/getc/mod.ts"

const { STATIC_HOST, WORKSPACE_PORT } = getc(["STATIC_HOST", "WORKSPACE_PORT"])

await runCommand("npm", ["run", "dev"], "./srv/workspace", {
	PORT: WORKSPACE_PORT,
	REACT_APP_STATIC_HOST: STATIC_HOST,
}).orElse(console.error)
