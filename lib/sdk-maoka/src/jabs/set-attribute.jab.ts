import { type Maoka, maoka_dom } from "@ordo-pink/maoka"

export const set_attribute_jab =
	(key: string, value = ""): Maoka.Jab =>
	({ use }) => {
		use(maoka_dom.jabs.if_dom(n => n.value.setAttribute(key, value)))
		// TODO if_string
	}

export const set_id_jab =
	(id?: string): Maoka.Jab =>
	({ use, node }) =>
		use(set_attribute_jab("id", id ?? String(node.id)))
