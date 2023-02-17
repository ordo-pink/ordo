/**
 * Logger type with methods in accordance with RFC5424
 *
 * @see https://www.rfc-editor.org/rfc/rfc5424
 */
export type Logger = {
  /**
   * Severity Level 0: Emergency: system is unusable.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  panic: <T>(message: T) => void

  /**
   * Severity Level 1: Alert: action must be taken immediately.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  alert: <T>(message: T) => void

  /**
   * Severity Level 2: Critical: critical conditions.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  critical: <T>(message: T) => void

  /**
   * Severity Level 3: Error: error conditions.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  error: <T>(message: T) => void

  /**
   * Severity Level 4: Warning: warning conditions.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  warn: <T>(message: T) => void

  /**
   * Severity level 5: Notice: normal but significant condition.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  notice: <T>(message: T, verbose?: boolean) => void

  /**
   * Severity level 6: Informational: informational messages.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  info: <T>(message: T, verbose?: boolean) => void

  /**
   * Severity level 7: Debug: debug-level messages.
   *
   * Setting verbose to true will only log the message if verbose mode is
   * enabled.
   */
  debug: <T>(message: T, verbose?: boolean) => void
}
