/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka_dom } from "@ordo-pink/oss-maoka"

import type { MaokaSDK } from "../sdk-client-maoka.types"
import { set_attribute_jab } from "./set-attribute.jab"

export namespace class_jabs {
	export const set =
		(...classes: string[]): Maoka.Jab =>
		({ use }) =>
			use(set_attribute_jab("class", classes.join(" ")))

	export const add =
		(...classes: string[]): Maoka.Jab =>
		({ use }) => {
			use(maoka_dom.jabs.if_dom(n => n.value.classList.add(...classes.flatMap(cls => cls.split(" ")))))
			// TODO if_string
		}

	export const remove =
		<$Class extends string>(...classes: MaokaSDK.Pouch.NoSpaceString<$Class>[]): Maoka.Jab =>
		({ use }) => {
			use(maoka_dom.jabs.if_dom(n => n.value.classList.remove(...classes.flatMap(cls => cls.split(" ")))))
			// TODO if_string
		}

	export const replace =
		<$Prev extends string, $Next extends string>(
			prev: MaokaSDK.Pouch.NoSpaceString<$Prev>,
			next: MaokaSDK.Pouch.NoSpaceString<$Next>,
		): Maoka.Jab =>
		({ use }) => {
			use(maoka_dom.jabs.if_dom(n => n.value.classList.replace(prev, next)))
			// TODO if_string
		}
}
