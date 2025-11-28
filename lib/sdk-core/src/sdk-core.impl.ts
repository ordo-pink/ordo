/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import "@ordo-pink/oss-oath/global"
import "@ordo-pink/oss-result/global"

export { impl as code } from "./modules/code.impl"
export { impl as data } from "./modules/data.impl"
export { impl as fns } from "./modules/fns.impl"
export { impl as rrr } from "./modules/rrr.impl"
export { impl as f } from "./modules/f.impl"
export { impl as permission } from "./modules/permission.impl"
export { impl as sem_ver } from "./modules/sem-ver.impl"
export { impl as session } from "./modules/session.impl"
export { impl as timestamp } from "./modules/timestamp.impl"
export { impl as user } from "./modules/user.impl"
export { impl as uuid } from "./modules/uuid.impl"
export { impl as validations } from "./modules/validations.impl"

export const todo: Ordo.Todo = () => {
	ordo.logger.alert("Not Implemented")
	if (globalThis.process) process.exitCode = 1
	else throw new Error("Todo reached!")
}

const out = console

// ;(globalThis as any).console = undefined

export const logger: Ordo.Logger = {
	alert: (...args: any[]) => out.error("🚨 [ALRT]:", ...args),
	crit: (...args: any[]) => out.error("🚑️ [CRIT]:", ...args),
	debug: (...args: any[]) => out.debug("🔨 [DEBG]:", ...args),
	error: (...args: any[]) => out.error("💥 [ERRR]:", ...args),
	notice: (...args: any[]) => out.info("📝 [NOTE]:", ...args),
	info: (...args: any[]) => out.info("✅ [INFO]:", ...args),
	panic: (...args: any[]) => out.error("🔥 [PANC]:", ...args),
	warn: (...args: any[]) => out.warn("⚠️ [WARN]:", ...args),
}
