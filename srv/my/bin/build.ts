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

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { die, run_command } from "@ordo-pink/binutil"
import { readdir0 } from "@ordo-pink/fs"

void run_command("rm -rf ./var/out/my")
	.pipe(ops0.chain(() => run_command("npm run build", { cwd: "./srv/my", env: { ...process.env, NODE_ENV: "production" } })))
	.pipe(ops0.chain(() => readdir0("./srv/my/static", { withFileTypes: true })))
	.pipe(ops0.chain(files => Oath.Merge(files.map(f => Bun.write(`./var/out/my/${f.name}`, Bun.file(`./srv/my/static/${f.name}`))))))
	.pipe(ops0.chain(() => Oath.FromPromise(() => Bun.write("./var/out/my/_redirects", "/* /index.html 200"))))
	.invoke(invokers0.or_else(die()))
