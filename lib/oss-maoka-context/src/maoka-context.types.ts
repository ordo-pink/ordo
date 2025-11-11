/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"

/** Global internal state of the context. Uses {@link Maoka.Root root} id to evaluate access rights. */
export type InternalState = Record<Maoka.Id, any>

/** Context instance. */
export type Instance<$Value> = {
	/** Consume jab returns whatever was provided to the context under the current maoka root. */
	consume: Maoka.Jab<$Value>
	/** Provides whatever passed to the context under the current maoka root. */
	provide: (value: $Value) => Maoka.Jab
}

/** Creates context instance bound to the current {@link Maoka..Root maoka root} node. */
export type Create = <$Value>() => Instance<$Value>
