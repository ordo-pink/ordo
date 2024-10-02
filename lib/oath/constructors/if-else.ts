// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const if_else_oath =
	<$TResolve, $TOnTrue = $TResolve, $TOnFalse = $TResolve>(
		validate: (x: $TResolve) => boolean,
		{
			on_true = x => x as any,
			on_false = x => x as any,
		}: {
			on_true?: (x: $TResolve) => $TOnTrue
			on_false?: (x: $TResolve) => $TOnFalse
		},
		abort_controller = new AbortController(),
	) =>
	(x: $TResolve) =>
		validate(x)
			? Oath.Resolve(on_true(x), abort_controller)
			: Oath.Reject(on_false(x), abort_controller)
