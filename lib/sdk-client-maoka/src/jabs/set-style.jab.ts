/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const set_style: (str: Partial<Omit<CSSStyleDeclaration, "length" | "parentRule">>) => Maoka.Jab =
	s =>
	({ use }) => {
		use(maoka_dom.jabs.if_dom(n => Object.keys(s).forEach(k => ((n.value.style as any)[k] = (s as any)[k]))))
	}
