/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Oath } from "../../oath.types"

export const noop_cata: Oath.Catas.Noop = () => ({
	reject: () => void 0,
	resolve: () => void 0,
})
