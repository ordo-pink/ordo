// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
	crit: <T extends any[]>(...message: T) => void

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
