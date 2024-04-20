// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { try0 } from "../constructors/try"

export const oathify =
	<Args extends any[], Result extends Promise<any>>(f: (...args: Args) => Result) =>
	(...args: Args) =>
		try0(() => f(...args))
