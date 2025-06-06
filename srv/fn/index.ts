/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { RoutaryOrdo, default_handler } from "@ordo-pink/routary-ordo"
import { LOCALE } from "@ordo-pink/i18n"
import { Logger } from "@ordo-pink/logger"
import { console_logger } from "@ordo-pink/logger"
import { oath } from "@ordo-pink/oath"
import { rickroll } from "@ordo-pink/rickroll"
import { routary } from "@ordo-pink/routary"

const logger: Logger = {
	alert: (...message) => console_logger.alert("[FN]", ...message),
	crit: (...message) => console_logger.crit("[FN]", ...message),
	debug: (...message) => console_logger.debug("[FN]", ...message),
	error: (...message) => console_logger.error("[FN]", ...message),
	info: (...message) => console_logger.info("[FN]", ...message),
	notice: (...message) => console_logger.notice("[FN]", ...message),
	panic: (...message) => console_logger.panic("[FN]", ...message),
	warn: (...message) => console_logger.warn("[FN]", ...message),
}

const rotor = routary
	.http<RoutaryOrdo.Fuel>({ logger, status: 200, headers: new Headers(), request_language: LOCALE.ENGLISH })
	.get(
		"/",
		default_handler(intake => oath.of(intake).pipe(oath.ops.tap(intake => void (intake.payload = "list")))),
	)
	.get(
		"/categories",
		default_handler(intake => oath.of(intake).pipe(oath.ops.tap(intake => void (intake.payload = "categories")))),
	)
	.get(
		"/categories/:id",
		default_handler(intake => oath.of(intake).pipe(oath.ops.tap(intake => void (intake.payload = "category")))),
	)
	.get(
		"/fns/:id",
		default_handler(intake => oath.of(intake).pipe(oath.ops.tap(intake => void (intake.payload = "fn")))),
	)
	.put(
		"/fns/:id",
		default_handler(intake => oath.of(intake).pipe(oath.ops.tap(intake => void (intake.payload = "upsert fn")))),
	)

const server = Bun.serve({
	port: process.env.ORDO_FN_PORT,
	fetch: rotor.start(() => rickroll),
})

logger.info(`server running on http://${server.hostname}:${server.port}`)
