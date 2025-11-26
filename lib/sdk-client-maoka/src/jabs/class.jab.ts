/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

import { set_attribute } from "./attribute.jab"

export const set_class: (...classes: string[]) => Maoka.Jab =
	(...cs) =>
	({ use }) =>
		use(set_attribute("class", cs.join(" ")))

export const add_class: (...classes: string[]) => Maoka.Jab =
	(...cs) =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(n => n.value.classList.add(...cs.flatMap(cls => cls.split(" ")))))

export const has_class: (cls: string) => Maoka.Jab<boolean> =
	c =>
	({ use }) => {
		let has_class = false

		const handle_if_dom = (n: Maoka.Node<HTMLElement>) => {
			has_class = n.value.classList.contains(c)
		}

		use(maoka_dom.jabs.if_dom(handle_if_dom))

		return has_class
	}

export const remove_class: <$Class extends string>(...classes: OrdoClientMaoka.NoSpaceString<$Class>[]) => Maoka.Jab =
	(...cs) =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(n => n.value.classList.remove(...cs.flatMap(cls => cls.split(" ")))))

export const replace_class: <$Prev extends string, $Next extends string>(
	prev: OrdoClientMaoka.NoSpaceString<$Prev>,
	next: OrdoClientMaoka.NoSpaceString<$Next>,
) => Maoka.Jab =
	(p, n) =>
	({ use }) =>
		use(maoka_dom.jabs.if_dom(x => x.value.classList.replace(p, n)))
