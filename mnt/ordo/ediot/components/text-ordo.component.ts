import { maoka } from "@ordo-pink/oss-maoka"

export const text_ordo = maoka.create<{ data: Ordo.Data.Instance }>("div", ({ data }) => {
	return () => ordo.data.get_name(data)
})
