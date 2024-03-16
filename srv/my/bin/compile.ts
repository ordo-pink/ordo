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

import { die, runCommand0 } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"

const { ORDO_STATIC_HOST, ORDO_ID_HOST, ORDO_WEB_HOST, ORDO_DT_HOST, ORDO_WORKSPACE_HOST } = getc([
	"ORDO_STATIC_HOST",
	"ORDO_ID_HOST",
	"ORDO_WEB_HOST",
	"ORDO_DT_HOST",
	"ORDO_WORKSPACE_HOST",
])

void runCommand0("npm run build", {
	cwd: "./srv/my",
	stdin: "inherit",
	stderr: "inherit",
	env: {
		...process.env,
		VITE_ORDO_STATIC_HOST: ORDO_STATIC_HOST,
		VITE_ORDO_ID_HOST: ORDO_ID_HOST,
		VITE_ORDO_WEBSITE_HOST: ORDO_WEB_HOST,
		VITE_ORDO_DT_HOST: ORDO_DT_HOST,
		VITE_ORDO_WORKSPACE_HOST: ORDO_WORKSPACE_HOST,
		NODE_ENV: "production",
	},
}).orElse(die())
