/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka_dom } from "@ordo-pink/maoka"

export const set_style_jab =
	(str: Partial<Omit<CSSStyleDeclaration, "length" | "parentRule">>): Maoka.Jab =>
	({ use }) => {
		use(maoka_dom.jabs.if_dom(n => Object.keys(str).forEach(k => ((n.value.style as any)[k] = (str as any)[k]))))
	}
