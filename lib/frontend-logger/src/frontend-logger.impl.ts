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

import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { type TGetLoggerFn } from "@ordo-pink/core"
import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

let logger: TLogger

type TInitLoggerFn = (logger: TLogger) => { logger: TLogger; get_logger: TGetLoggerFn }
export const __init_logger: TInitLoggerFn = call_once(x => {
	logger = x

	return { logger, get_logger: _get_logger }
})

// TODO: Make non-exported
export const _get_logger = (fid: symbol | null): TLogger => {
	const functionName = KnownFunctions.exchange(fid) ?? "unauthorized"

	return {
		panic: (...message) => logger.panic(`@${functionName} ::`, ...message),
		alert: (...message) => logger.alert(`@${functionName} ::`, ...message),
		crit: (...message) => logger.crit(`@${functionName} ::`, ...message),
		error: (...message) => logger.error(`@${functionName} ::`, ...message),
		warn: (...message) => logger.warn(`@${functionName} ::`, ...message),
		notice: (...message) => logger.notice(`@${functionName} ::`, ...message),
		info: (...message) => logger.info(`@${functionName} ::`, ...message),
		debug: (...message) => logger.debug(`@${functionName} ::`, ...message),
	}
}
