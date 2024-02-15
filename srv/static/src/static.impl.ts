// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

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
