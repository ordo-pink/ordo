// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type * as T from "./types"

/**
 * An average console enjoyer.
 */
export const ConsoleLogger: T.Logger = {
	alert: (...args) => console.error(`🚨 [${new Date(Date.now()).toISOString()}] [ALRT]:`, ...args),
	crit: (...args) => console.error(`🚑️ [${new Date(Date.now()).toISOString()}] [CRIT]:`, ...args),
	debug: (...args) => console.debug(`🔨 [${new Date(Date.now()).toISOString()}] [DEBG]:`, ...args),
	error: (...args) => console.error(`💥 [${new Date(Date.now()).toISOString()}] [ERRR]:`, ...args),
	notice: (...args) => console.info(`📝 [${new Date(Date.now()).toISOString()}] [NOTE]:`, ...args),
	info: (...args) => console.info(`✅ [${new Date(Date.now()).toISOString()}] [INFO]:`, ...args),
	panic: (...args) => console.error(`🔥 [${new Date(Date.now()).toISOString()}] [PANC]:`, ...args),
	warn: (...args) => console.warn(`⚠️ [${new Date(Date.now()).toISOString()}] [WARN]:`, ...args),
}

/**✓
 * An average silence fan.
 */
export const IgnoreLogger: T.Logger = {
	alert: () => void 0,
	crit: () => void 0,
	debug: () => void 0,
	error: () => void 0,
	notice: () => void 0,
	info: () => void 0,
	panic: () => void 0,
	warn: () => void 0,
}
