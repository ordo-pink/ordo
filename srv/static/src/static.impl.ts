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

import chalk from "chalk"

import { ConsoleLogger } from "@ordo-pink/logger"
import { createRouter } from "./create-router"
import { getc } from "@ordo-pink/getc"

const { ORDO_STATIC_ROOT, ORDO_STATIC_PORT } = getc(["ORDO_STATIC_ROOT", "ORDO_STATIC_PORT"])
const logger = ConsoleLogger
const serverName = "ST"
const root = ORDO_STATIC_ROOT
const port = Number(ORDO_STATIC_PORT)

/**
 * ST is a helper service mainly used for local development. It serves static files used by other
 * srvs. In production, other srvs are instructed to refer to a public static source (e.g. an S3
 * bucket) to get their assets.
 *
 * NOTE: if you add an asset, don't forget to restart ST service (`bin/run`) to make sure it copies
 * the asset you've added.
 *
 * Created by @Amzoobalance
 */
const main = () => {
	Bun.serve({ port, fetch: createRouter({ root, serverName, logger }) })

	logger.info(`ST running on http://localhost:${chalk.blue(port)}`)
}

// --- Internal ---

main()
