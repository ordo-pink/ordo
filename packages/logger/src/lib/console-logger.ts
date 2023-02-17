/* eslint-disable no-console */
import { Logger } from "./types"

/**
 * An average console enjoyer.
 */
export const ConsoleLogger: Logger = {
  alert: console.error,
  critical: console.error,
  debug: console.debug,
  error: console.error,
  notice: console.info,
  info: console.info,
  panic: console.error,
  warn: console.warn,
}
