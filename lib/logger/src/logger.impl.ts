/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { Logger } from "./logger.types"

/**
 * An average console enjoyer.
 */
export const console_logger: Logger = {
	alert: (...args) => console.error("🚨 [ALRT]:", ...args),
	crit: (...args) => console.error("🚑️ [CRIT]:", ...args),
	debug: (...args) => console.debug("🔨 [DEBG]:", ...args),
	error: (...args) => console.error("💥 [ERRR]:", ...args),
	notice: (...args) => console.info("📝 [NOTE]:", ...args),
	info: (...args) => console.info("✅ [INFO]:", ...args),
	panic: (...args) => console.error("🔥 [PANC]:", ...args),
	warn: (...args) => console.warn("⚠️ [WARN]:", ...args),
}

/**✓
 * An average silence fan.
 */
export const ignore_logger: Logger = {
	alert: () => void 0,
	crit: () => void 0,
	debug: () => void 0,
	error: () => void 0,
	notice: () => void 0,
	info: () => void 0,
	panic: () => void 0,
	warn: () => void 0,
}
