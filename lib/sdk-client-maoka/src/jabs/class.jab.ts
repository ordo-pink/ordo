import { Maoka, maoka } from "@ordo-pink/oss-maoka"

import type { NoSpaceString } from "../sdk-client-maoka.types"
import { set_attribute } from "./attribute.jab"

export const set_class =
	(...classes: string[]): Maoka.Jab =>
	({ use }) =>
		use(set_attribute("class", classes.join(" ")))

export const add_class =
	(...classes: string[]): Maoka.Jab =>
	({ use }) => {
		use(maoka.dom.jabs.if_dom(n => n.value.classList.add(...classes.flatMap(cls => cls.split(" ")))))
		// TODO if_string
	}

export const remove_class =
	<$Class extends string>(...classes: NoSpaceString<$Class>[]): Maoka.Jab =>
	({ use }) => {
		use(maoka.dom.jabs.if_dom(n => n.value.classList.remove(...classes.flatMap(cls => cls.split(" ")))))
		// TODO if_string
	}

export const replace_class =
	<$Prev extends string, $Next extends string>(prev: NoSpaceString<$Prev>, next: NoSpaceString<$Next>): Maoka.Jab =>
	({ use }) => {
		use(maoka.dom.jabs.if_dom(n => n.value.classList.replace(prev, next)))
		// TODO if_string
	}
