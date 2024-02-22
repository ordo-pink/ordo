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

import type { Unpack, ValidatorFn } from "@ordo-pink/tau"

/**
 * Helper object that contains a pointing interface to put value
 * into Switch.
 */
export type TSwitchStatic = {
	/**
	 * A pointing interface to put the value into Switch.
	 *
	 * @example `Switch.of(myVariableWithIDontKnowWhichThingInside)`
	 */
	of: <TResult extends unknown[] = [], TContext = unknown>(
		x: TContext,
	) => TSwitch<TContext, TResult>

	/**
	 * Create an empty switch that compares provided values against `true`.
	 */
	empty: <TResult extends unknown[] = []>() => TSwitch<boolean, TResult>

	/**
	 * Create an empty switch that compares provided values against `false`.
	 */
	negate: <TResult extends unknown[] = []>() => TSwitch<boolean, TResult>
}

/**
 * Switch is an alternative to the good (???) old switch statement. Unlike the
 * ordinary switch that only allows you to compare values, Switch also enables
 * you to use validator functions that accept the value kept inside Switch and
 * return a boolean. If the function returns true, the value inside Switch is
 * considered matched.
 *
 * Keep in mind that Switch is a lazy fellow so it will not return the value if
 * the case was matched. You will always get the Switch back. If you want the
 * Switch to fold and give you back the value, you have to end the case chain
 * with the `.default` call.
 */
export type TSwitch<TContext, TResult extends unknown[]> = {
	/**
	 * Define cases like you would normally do with a switch statement, or use
	 * predicate functions to validate the value held inside Switch.
	 *
	 * @example `Switch.of(1).case(1, () => "one!").case(2, () => "Numbers, mate, remember numbers!")`
	 * @example `Switch.of(myNumber).case((n) => n % 2 === 0, () => "even").case((n) => n % 2 === -1, () => "this is odd!")`
	 */
	case: <TNewResult>(
		/**
		 * A value to compare with, or a validator function that accepts the value
		 * held inside Switch and returns a boolean.
		 */
		predicate: TContext | ValidatorFn<TContext>,

		/**
		 * A thunk containing the value the Switch is to return when you fold the
		 * Switch with the `.default` method. This will only happen to the onTrue
		 * thunk that is defined for the matched case. If none of the cases did
		 * match, the `.default` argument thunk will be called.
		 */
		onTrue: (x: TContext) => TNewResult,
	) => TSwitch<TContext, [Unpack<TResult>, TNewResult]>

	/**
	 * Folds the Switch and returns a value that was defined in the matched
	 * case onTrue thunk. If none of the case matched, the thunk provided as
	 * `.default` argument will be called instead.
	 *
	 * @example `Switch.of(myBoolean).case(true, () => "oh, thanks!").default(() => "You WHAT?")`
	 */
	default: <TDefaultResult>(
		onAllFalse: (x: TContext) => TDefaultResult,
	) => Unpack<TResult> | TDefaultResult
}
