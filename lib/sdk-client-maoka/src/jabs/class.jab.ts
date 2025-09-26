import { Maoka, maoka } from "@ordo-pink/oss-maoka"

import type { NoSpaceString } from "../sdk-client-maoka.types"
import { set_attribute } from "./attribute.jab"

export const set_class: OrdoClientMaoka.Jabs.SetClass =
	(...cs) =>
	({ use }) =>
		use(set_attribute("class", cs.join(" ")))

export const add_class: OrdoClientMaoka.Jabs.AddClass =
	(...cs) =>
	({ use }) =>
		use(maoka.dom.jabs.if_dom(n => n.value.classList.add(...cs.flatMap(cls => cls.split(" ")))))

export const remove_class: OrdoClientMaoka.Jabs.RemoveClass =
	(...cs) =>
	({ use }) =>
		use(maoka.dom.jabs.if_dom(n => n.value.classList.remove(...cs.flatMap(cls => cls.split(" ")))))

export const replace_class: OrdoClientMaoka.Jabs.ReplaceClass =
	(p, n) =>
	({ use }) =>
		use(maoka.dom.jabs.if_dom(x => x.value.classList.replace(p, n)))

declare global {
	namespace OrdoClientMaoka.Jabs {
		export type SetClass = (...classes: string[]) => Maoka.Jab
		export type AddClass = (...classes: string[]) => Maoka.Jab
		export type RemoveClass = <$Class extends string>(...classes: NoSpaceString<$Class>[]) => Maoka.Jab
		export type ReplaceClass = <$Prev extends string, $Next extends string>(
			prev: NoSpaceString<$Prev>,
			next: NoSpaceString<$Next>,
		) => Maoka.Jab
	}
}
