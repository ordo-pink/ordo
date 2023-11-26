// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { runAsyncCommand0 } from "@ordo-pink/binutil"

runAsyncCommand0("opt/bun run --watch srv/data/index.ts", {
	stdout: "pipe",
	stderr: "pipe",
	env: { ...process.env, FORCE_COLOR: "1" },
}).orElse(console.error)
