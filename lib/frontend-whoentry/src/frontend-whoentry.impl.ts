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

import { ConsoleLogger, IgnoreLogger } from "@ordo-pink/logger"

import { WhoEntryLoggerStatic } from "./frontend-whoentry.types"

export const WhoEntryLogger: WhoEntryLoggerStatic = {
	create: ({ clientLogger = ConsoleLogger, host, env = "development" }) => {
		return {
			alert: (...args) => {
				clientLogger.alert(...args)
			},
			crit: (...args) => {
				clientLogger.crit(...args)
			},
			debug: (...args) => {
				clientLogger.debug(...args)
			},
			error: (...args) => {
				clientLogger.error(...args)
			},
			notice: (...args) => {
				clientLogger.notice(...args)
			},
			info: (...args) => {
				clientLogger.info(...args)
			},
			panic: (...args) => {
				clientLogger.panic(...args)
			},
			warn: (...args) => {
				clientLogger.warn(...args)
			},
		}
	},

	empty: () => ConsoleLogger,
	silent: () => IgnoreLogger,
}
