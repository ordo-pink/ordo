// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const ifElse0 =
	<Resolve, OnTrue = Resolve, OnFalse = Resolve>(
		validate: (x: Resolve) => boolean,
		{
			onTrue = x => x as any,
			onFalse = x => x as any,
		}: {
			onTrue?: (x: Resolve) => OnTrue
			onFalse?: (x: Resolve) => OnFalse
		},
		abortController = new AbortController(),
	) =>
	(x: Resolve) =>
		validate(x)
			? Oath.resolve(onTrue(x), abortController)
			: Oath.reject(onFalse(x), abortController)
