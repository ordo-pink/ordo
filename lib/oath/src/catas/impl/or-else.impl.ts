/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Oath } from "../../oath.types"

export const or_else_cata: Oath.Catas.OrElse = reject => ({
	reject,
	resolve: x => x,
})
