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

import { die, run_command } from "@ordo-pink/cmd-runner"
import { getc } from "@ordo-pink/getc"
import { oath } from "@ordo-pink/oath"

const { ORDO_ID_HOST, ORDO_DT_HOST, ORDO_PB_HOST, ORDO_AU_HOST } = getc([
	"ORDO_AU_HOST",
	"ORDO_ID_HOST",
	"ORDO_DT_HOST",
	"ORDO_PB_HOST",
])

void run_command("npm run dev", {
	cwd: "./srv/web",
	stdin: "inherit",
	stdout: "inherit",
	env: {
		...process.env,
		VITE_ORDO_ID_HOST: ORDO_ID_HOST,
		VITE_ORDO_PB_HOST: ORDO_PB_HOST,
		VITE_ORDO_DT_HOST: ORDO_DT_HOST,
		VITE_ORDO_AU_HOST: ORDO_AU_HOST,
		FORCE_COLOR: "1",
	},
}).cata(oath.catas.or_else(die()))
