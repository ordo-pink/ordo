// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const fromNullable0 = <Resolve>(
	value?: Resolve | null,
	abortController = new AbortController(),
): Oath<NonNullable<Resolve>, null> =>
	value == null ? Oath.reject(null, abortController) : Oath.resolve(value, abortController)
