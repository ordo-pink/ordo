// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { getDenoPath, runDenoCommand } from "#lib/binutil/mod.ts"
import { identity } from "#ramda"

await runDenoCommand(getDenoPath(), [
	"run",
	"--allow-net",
	"--allow-env",
	"--allow-read",
	"--allow-write",
	"--allow-run",
	"--unstable",
	"--watch",
	"srv/id/mod.ts",
]).fork(identity, identity)
