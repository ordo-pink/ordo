// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const from_falsy_oath = <$TResolve, $TReject = null>(
	value: $TResolve,
	on_false: $TReject = null as any,
	abort_controller = new AbortController(),
): Oath<$TResolve, $TReject> =>
	value ? Oath.Resolve(value, abort_controller) : Oath.Reject(on_false, abort_controller)

export const from_boolean_oath = <$TResolve, $TReject = null>(
	value: boolean,
	on_true: $TResolve,
	on_false: $TReject = null as any,
	abort_controller = new AbortController(),
): Oath<$TResolve, $TReject> =>
	value ? Oath.Resolve(on_true, abort_controller) : Oath.Reject(on_false, abort_controller)

export type TIfOathConstructorFn = <$TResolve = undefined, $TReject = undefined>(
	predicate: boolean,
	returns?: { T?: () => $TResolve; F?: () => $TReject },
	abort_controller?: AbortController,
) => Oath<$TResolve, $TReject>

export const if_oath: TIfOathConstructorFn = (
	predicate: boolean,
	{ T = () => undefined as any, F = () => undefined as any } = {
		T: () => undefined as any,
		F: () => undefined as any,
	},
	abort_controller = new AbortController(),
) => (predicate ? Oath.Resolve(T(), abort_controller) : Oath.Reject(F(), abort_controller))
