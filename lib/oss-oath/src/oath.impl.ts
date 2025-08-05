/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Oath } from "./oath.types.ts"
import { catas } from "./catas/index.ts"
import { constructors } from "./constructors/index.ts"
import { ops } from "./ops/index.ts"

export const oath: Oath.Static = { ...constructors, catas, ops }
