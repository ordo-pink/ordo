import { Logger } from "./types"

/**
 * An average silence fan.
 */
export const IgnoreLogger: Logger = {
  alert: () => void 0,
  critical: () => void 0,
  debug: () => void 0,
  error: () => void 0,
  notice: () => void 0,
  info: () => void 0,
  panic: () => void 0,
  warn: () => void 0,
}
