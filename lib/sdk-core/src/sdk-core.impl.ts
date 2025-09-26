/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import "@ordo-pink/oss-oath/global"
import "@ordo-pink/oss-result/global"

export * as data from "./modules/data.impl"
export * as fns from "./modules/fns.impl"
export * as rrr from "./modules/rrr.impl"
export * as sem_ver from "./modules/sem-ver.impl"
export * as timestamp from "./modules/timestamp.impl"
export * as user from "./modules/user.impl"
export * as uuid from "./modules/uuid.impl"
export * as validations from "./modules/validations.impl"

export const todo: Ordo.Todo = () => {
	ordo.logger.alert("Not Implemented")
	if (globalThis.process) process.exitCode = 1
	else throw new Error("Todo reached!")
}

export const logger: Ordo.Logger = {
	alert: (...args: any[]) => console.error("🚨 [ALRT]:", ...args),
	crit: (...args: any[]) => console.error("🚑️ [CRIT]:", ...args),
	debug: (...args: any[]) => console.debug("🔨 [DEBG]:", ...args),
	error: (...args: any[]) => console.error("💥 [ERRR]:", ...args),
	notice: (...args: any[]) => console.info("📝 [NOTE]:", ...args),
	info: (...args: any[]) => console.info("✅ [INFO]:", ...args),
	panic: (...args: any[]) => console.error("🔥 [PANC]:", ...args),
	warn: (...args: any[]) => console.warn("⚠️ [WARN]:", ...args),
}
