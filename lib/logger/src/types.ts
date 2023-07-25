// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// deno-lint-ignore-file no-explicit-any

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
	panic: <T extends any[]>(...message: T) => void

	/**
	 * Severity Level 1: Alert: action must be taken immediately.
	 *
	 * Setting verbose to true will only log the message if verbose mode is
	 * enabled.
	 */
	alert: <T extends any[]>(...message: T) => void

	/**
	 * Severity Level 2: Critical: critical conditions.
	 *
	 * Setting verbose to true will only log the message if verbose mode is
	 * enabled.
	 */
	critical: <T extends any[]>(...message: T) => void

	/**
	 * Severity Level 3: Error: error conditions.
	 *
	 * Setting verbose to true will only log the message if verbose mode is
	 * enabled.
	 */
	error: <T extends any[]>(...message: T) => void

	/**
	 * Severity Level 4: Warning: warning conditions.
	 *
	 * Setting verbose to true will only log the message if verbose mode is
	 * enabled.
	 */
	warn: <T extends any[]>(...message: T) => void

	/**
	 * Severity level 5: Notice: normal but significant condition.
	 */
	notice: <T extends any[]>(...message: T) => void

	/**
	 * Severity level 6: Informational: informational messages.
	 */
	info: <T extends any[]>(...message: T) => void

	/**
	 * Severity level 7: Debug: debug-level messages.
	 */
	debug: <T extends any[]>(...message: T) => void
}
