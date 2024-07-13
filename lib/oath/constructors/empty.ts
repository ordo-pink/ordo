// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath } from "../src/impl"

export const empty_oath = <$TReject = never>(
	abort_controller = new AbortController(),
): Oath<void, $TReject> => new Oath(resolve => resolve(undefined), abort_controller)
