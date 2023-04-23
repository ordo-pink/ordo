/* eslint-disable no-console */
import { Logger } from "./types"

/**
 * An average console enjoyer.
 */
export const ConsoleLogger: Logger = {
  alert: (...args) => console.error("🚨 [ALERT]: ", ...args),
  critical: (...args) => console.error("🚑️ [CRIT]: ", ...args),
  debug: (...args) => console.debug("🔨 [DEBUG]: ", ...args),
  error: (...args) => console.error("💥 [ERROR]: ", ...args),
  notice: (...args) => console.info("📝 [NOTICE]: ", ...args),
  info: (...args) => console.info("💡 [INFO]: ", ...args),
  panic: (...args) => console.error("🔥 [PANIC]: ", ...args),
  warn: (...args) => console.warn("⚠️ [WARN]: ", ...args),
}
