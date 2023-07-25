// SPDX-FileCopyrightText: Copyright 2023, Sergei Orlov and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import type { T as TAU } from "#lib/tau/mod.ts"

/**
 * Helper object that contains a pointing interface to put value
 * into Switch.
 */
export type SwitchStatic = {
	/**
	 * A pointing interface to put the value into Switch.
	 *
	 * @example `Switch.of(myVariableWithIDontKnowWhichThingInside)`
	 */
	of: <TResult extends unknown[] = [], TContext = unknown>(x: TContext) => Switch<TContext, TResult>
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
export type Switch<TContext, TResult extends unknown[]> = {
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
		predicate: TContext | TAU.ValidatorFn<TContext>,

		/**
		 * A thunk containing the value the Switch is to return when you fold the
		 * Switch with the `.default` method. This will only happen to the onTrue
		 * thunk that is defined for the matched case. If none of the cases did
		 * match, the `.default` argument thunk will be called.
		 */
		onTrue: () => TNewResult
	) => Switch<TContext, [TAU.Unpack<TResult>, TNewResult]>

	/**
	 * Folds the Switch and returns a value that was defined in the matched
	 * case onTrue thunk. If none of the case matched, the thunk provided as
	 * `.default` argument will be called instead.
	 *
	 * @example `Switch.of(myBoolean).case(true, () => "oh, thanks!").default(() => "You WHAT?")`
	 */
	default: <TDefaultResult>(
		onAllFalse: () => TDefaultResult
	) => TAU.Unpack<TResult> | TDefaultResult
}
