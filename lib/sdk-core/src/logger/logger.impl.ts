/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Logger } from "./logger.types"

export namespace logger {
	/**
	 * An average silence fan.
	 */
	export const ignore: Logger = {
		alert: () => void 0,
		crit: () => void 0,
		debug: () => void 0,
		error: () => void 0,
		notice: () => void 0,
		info: () => void 0,
		panic: () => void 0,
		warn: () => void 0,
	}

	/**
	 * An average console enjoyer.
	 */
	export const console: Logger = {
		alert: (...args) => console.error("🚨 [ALRT]:", ...args),
		crit: (...args) => console.error("🚑️ [CRIT]:", ...args),
		debug: (...args) => console.debug("🔨 [DEBG]:", ...args),
		error: (...args) => console.error("💥 [ERRR]:", ...args),
		notice: (...args) => console.info("📝 [NOTE]:", ...args),
		info: (...args) => console.info("✅ [INFO]:", ...args),
		panic: (...args) => console.error("🔥 [PANC]:", ...args),
		warn: (...args) => console.warn("⚠️ [WARN]:", ...args),
	}
}
