// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// This file is run with bun when executing "bin/run".
// Configure starting the app here.

import { runAsyncCommand0 } from "@ordo-pink/binutil"

runAsyncCommand0("bun run --watch srv/stats/index.ts", {
	stdout: "pipe",
	stderr: "pipe",
	env: { ...process.env, FORCE_COLOR: "1" },
}).orElse(console.log)
