/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export * as Helpers from "./helpers/helpers.types"

/**
 * Validation function type.
 *
 * @example `num => num > 3`
 */
export type Validator<$Arg> = (x: $Arg) => boolean

export type ToResult<$X, $Result> = (x: $X) => $Result

/**
 * A pointing interface to put the value into sweech.
 *
 * @example `sweech.match(myVariableWithIDontKnowWhichThingInside)`
 */
export type Match = <$X = unknown>(x: $X) => Instance<$X>

/**
 * sweech is an alternative to the good (???) old switch statement. Unlike the
 * ordinary switch that only allows you to compare values, sweech also enables
 * you to use validator functions that accept the value kept inside sweech and
 * return a boolean. If the function returns true, the value inside sweech is
 * considered matched.
 *
 * Keep in mind that sweech is a lazy fellow so it will not return the value if
 * the case was matched. You will always get the sweech back. If you want the
 * sweech to fold and give you back the value, you have to end the case chain
 * with the `.default` call.
 */
export type Instance<$X, $Result = never> = {
	/**
	 * Define cases like you would normally do with a switch statement, or use
	 * predicate functions to validate the value held inside sweech.
	 *
	 * @example `sweech.match(1).case(1, () => "one!").case(2, () => "Numbers, mate, remember numbers!")`
	 * @example `sweech.match(num).case((n) => n % 2 === 0, () => "even").case((n) => n % 2 === -1, () => "this is odd!")`
	 */
	case: <const _NewResult>(
		/**
		 * A value to compare with, or a validator function that accepts the value
		 * held inside sweech and returns a boolean.
		 */
		predicate: $X | Validator<$X> | $X[],

		/**
		 * A thunk containing the value the sweech is to return when you fold the
		 * sweech with the `.default` method. This will only happen to the onTrue
		 * thunk that is defined for the matched case. If none of the cases did
		 * match, the `.default` argument thunk will be called.
		 */
		on_true: (x: $X) => _NewResult,
	) => Instance<$X, $Result | _NewResult>

	/**
	 * Folds the sweech and returns a value that was defined in the matched
	 * case onTrue thunk. If none of the case matched, the thunk provided as
	 * `.default` argument will be called instead.
	 *
	 * @example `sweech.match(myBoolean).case(true, () => "oh, thanks!").default(() => "You WHAT?")`
	 */
	default: <const _DefaultResult>(on_none_matched: (x: $X) => _DefaultResult) => $Result | _DefaultResult
}
