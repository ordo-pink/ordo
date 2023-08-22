// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { runCommand0 } from "@ordo-pink/binutil"

runCommand0("npm i", {
	cwd: "./srv/workspace",
	stdin: "inherit",
	stderr: "inherit",
}).orElse(console.error)
