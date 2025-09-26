import type { Maoka } from "@ordo-pink/oss-maoka"
import { if_dom } from "@ordo-pink/oss-maoka"

export const set_attribute =
	(key: string, value = ""): Maoka.Jab =>
	({ use }) =>
		use(if_dom(n => n.value.setAttribute(key, value)))

export const set_id =
	(id?: string): Maoka.Jab =>
	({ use, node }) =>
		use(set_attribute("id", id ?? String(node.id)))
