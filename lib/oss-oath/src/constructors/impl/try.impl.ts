/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { reject, resolve } from "./of.impl"
import { type Oath } from "../../oath.types"

export const tryy: Oath.Constructors.Try = (tryer, catcher) => {
	try {
		return resolve(tryer())
	} catch (e) {
		return catcher ? reject(catcher(e as any)) : (reject(e) as any)
	}
}
