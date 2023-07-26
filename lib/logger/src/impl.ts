// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import type * as T from "./types.ts"

/**
 * An average console enjoyer.
 */
export const ConsoleLogger: T.Logger = {
	alert: (...args) => console.error("🚨 [ALERT]:", ...args),
	critical: (...args) => console.error("🚑️ [CRIT]:", ...args),
	debug: (...args) => console.debug("🔨 [DEBUG]:", ...args),
	error: (...args) => console.error("💥 [ERROR]:", ...args),
	notice: (...args) => console.info("📝 [NOTICE]:", ...args),
	info: (...args) => console.info("💡 [INFO]:", ...args),
	panic: (...args) => console.error("🔥 [PANIC]:", ...args),
	warn: (...args) => console.warn("⚠️ [WARN]:", ...args),
}

/**
 * An average silence fan.
 */
export const IgnoreLogger: T.Logger = {
	alert: () => void 0,
	critical: () => void 0,
	debug: () => void 0,
	error: () => void 0,
	notice: () => void 0,
	info: () => void 0,
	panic: () => void 0,
	warn: () => void 0,
}
