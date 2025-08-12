/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { reject, resolve } from "./of.impl"
import { type Oath } from "../../oath.types"

export const iif: Oath.Constructors.If = (condition, explosion) =>
	condition ? resolve(explosion?.t?.()) : (reject(explosion?.f?.()) as any)
