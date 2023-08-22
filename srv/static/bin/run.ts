// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { runAsyncCommand0 } from "@ordo-pink/binutil"

runAsyncCommand0("bun run --watch srv/static/index.ts", {
	stdout: "pipe",
	stderr: "pipe",
}).orElse(console.error)
