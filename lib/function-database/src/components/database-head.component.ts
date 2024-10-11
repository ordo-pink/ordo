import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

export const DatabaseHead = (keys: string[]) => thead(() => tr(() => keys.map(key => th(key))))

const thead = Maoka.styled("thead")
const tr = Maoka.styled("tr", { class: "database_table-head_row" })

const th = (key: string) =>
	Maoka.create("th", ({ use }) => {
		use(MaokaJabs.add_class("database_table-head_cell"))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()

			// TODO Handle sorting
			console.log("TODO sorting")
		}

		return () => key
	})
