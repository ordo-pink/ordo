// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { try_oath } from "../constructors/try"

export const oathify =
	<$TArgs extends any[], $TResult extends Promise<any>>(f: (...args: $TArgs) => $TResult) =>
	(...args: $TArgs) =>
		try_oath(() => f(...args))
