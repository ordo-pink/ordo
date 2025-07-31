import * as fns from "../fns/fns.impl"
import type { Logger, Todo } from "../sdk-core.types"

export namespace logger {
	/** An average silence fan. */
	export const shhhh: Logger = {
		alert: fns.v,
		crit: fns.v,
		debug: fns.v,
		error: fns.v,
		notice: fns.v,
		info: fns.v,
		panic: fns.v,
		warn: fns.v,
	}

	/** An average console enjoyer. */
	export const stout: Logger = {
		alert: (...args: any[]) => console.error("🚨 [ALRT]:", ...args),
		crit: (...args: any[]) => console.error("🚑️ [CRIT]:", ...args),
		debug: (...args: any[]) => console.debug("🔨 [DEBG]:", ...args),
		error: (...args: any[]) => console.error("💥 [ERRR]:", ...args),
		notice: (...args: any[]) => console.info("📝 [NOTE]:", ...args),
		info: (...args: any[]) => console.info("✅ [INFO]:", ...args),
		panic: (...args: any[]) => console.error("🔥 [PANC]:", ...args),
		warn: (...args: any[]) => console.warn("⚠️ [WARN]:", ...args),
	}
}

export const todo: Todo = message => {
	logger.stout.alert(message ?? "Not Implemented")
	if (globalThis.process) process.exitCode = 1
	else throw new Error("Todo reached!")
}
