/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"

export const set_style: OrdoClientMaoka.Jabs.SetStyle =
	s =>
	({ use }) => {
		use(maoka.dom.jabs.if_dom(n => Object.keys(s).forEach(k => ((n.value.style as any)[k] = (s as any)[k]))))
	}

declare global {
	namespace OrdoClientMaoka.Jabs {
		export type SetStyle = (str: Partial<Omit<CSSStyleDeclaration, "length" | "parentRule">>) => Maoka.Jab
	}
}
