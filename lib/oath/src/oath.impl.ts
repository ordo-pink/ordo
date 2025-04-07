/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

// deno-lint-ignore-file no-explicit-any

import type { Oath } from "./oath.types.ts"
import { catas } from "./catas"
import { constructors } from "./constructors"
import { ops } from "./ops"

export const oath: Oath.Static = { ...constructors, catas, ops }
