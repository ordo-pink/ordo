/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Oath, invokers0 } from "@ordo-pink/oath"
import { die, run_command } from "@ordo-pink/binutil"

const main = () =>
	run_command(clean_up_cmd).and(bundle_client_code).and(setup_netlify_redirects).invoke(invokers0.or_else(die()))

// --- Internal ---

const src_dir = "./srv/my"
const target_dir = "./var/out/my"

const clean_up_cmd = `rm -rf ${target_dir}`

const build_cmd = "npm run build"
const build_cmd_options = { cwd: src_dir, env: { ...process.env, NODE_ENV: "production" } }

const redirects_path = `${target_dir}/_redirects`
const redirects_content = "/* /index.html 200"

const bundle_client_code = () => run_command(build_cmd, build_cmd_options)

const setup_netlify_redirects = () => Oath.FromPromise(() => Bun.write(redirects_path, redirects_content))

// --- Invoke ---

void main()
