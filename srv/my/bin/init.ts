// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { die, runCommand0 } from "@ordo-pink/binutil"

runCommand0("bun i", {
	cwd: "./srv/my",
	stdin: "inherit",
	stderr: "inherit",
}).orElse(die())
