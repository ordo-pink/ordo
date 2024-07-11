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

import type * as T from "./types"
import { is_f } from "@ordo-pink/tau"

// --- Public ---

export const Switch: T.TSwitchStatic = {
	of: x => swich(x),
	empty: () => swich(true),
	negate: () => swich(false),
}

export const match = <T>(e: T): T.TSwitch<T, []> => Switch.of(e)

// --- Internal ---

const swichMatched = <TContext, TResult extends unknown[] = []>(
	x: TContext,
): T.TSwitch<TContext, TResult> => ({
	case: () => swichMatched(x),
	default: () => (x as any)(),
	_: () => (x as any)(),
})

const swich = <TContext, TResult extends unknown[] = []>(
	x: TContext,
): T.TSwitch<TContext, TResult> => ({
	case: (predicate, onTrue) => {
		const isTrue = is_f(predicate)
			? predicate(x)
			: Array.isArray(predicate)
				? predicate.includes(x)
				: predicate === x

		return isTrue ? swichMatched(() => onTrue(x)) : (swich(x) as any)
	},
	default: defaultValue => defaultValue(x),
	_: defaultValue => defaultValue(x),
})
