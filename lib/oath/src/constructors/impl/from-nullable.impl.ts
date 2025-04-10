/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { reject, resolve } from "./of.impl"
import { type Oath } from "../../oath.types"

export const from_nullable: Oath.Constructors.FromNullable = (x, on_null) =>
	x != null ? resolve(x) : (reject(on_null ? on_null() : null) as any)
