/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

import { set_attribute } from "./attribute.jab"

export const set_class: OrdoClientMaoka.Jabs.SetClass =
	(...cs) =>
	({ use }) =>
		use(set_attribute("class", cs.join(" ")))

export const add_class: OrdoClientMaoka.Jabs.AddClass =
	(...cs) =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(n => n.value.classList.add(...cs.flatMap(cls => cls.split(" ")))))

export const has_class: OrdoClientMaoka.Jabs.HasClass =
	c =>
	({ use }) => {
		let has_class = false

		use(
			maoka_dom.jabs.if_dom(n => {
				has_class = n.value.classList.contains(c)
			}),
		)

		return has_class
	}

export const remove_class: OrdoClientMaoka.Jabs.RemoveClass =
	(...cs) =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(n => n.value.classList.remove(...cs.flatMap(cls => cls.split(" ")))))

export const replace_class: OrdoClientMaoka.Jabs.ReplaceClass =
	(p, n) =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(x => x.value.classList.replace(p, n)))

declare global {
	namespace OrdoClientMaoka.Jabs {
		export type SetClass = (...classes: string[]) => Maoka.Jab
		export type HasClass = (cls: string) => Maoka.Jab<boolean>
		export type AddClass = (...classes: string[]) => Maoka.Jab
		export type RemoveClass = <$Class extends string>(...classes: OrdoClientMaoka.NoSpaceString<$Class>[]) => Maoka.Jab
		export type ReplaceClass = <$Prev extends string, $Next extends string>(
			prev: NoSpaceString<$Prev>,
			next: NoSpaceString<$Next>,
		) => Maoka.Jab
	}
}
