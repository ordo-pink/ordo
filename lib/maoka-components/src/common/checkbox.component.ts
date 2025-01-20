import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import "./checkbox.css"

export type TCheckboxParams = {
	on_change: (event: Event) => void
	checked?: boolean
}
export const Checkbox = ({ on_change, checked }: TCheckboxParams) =>
	Maoka.create("input", ({ use }) => {
		use(MaokaJabs.set_attribute("type", "checkbox"))
		use(MaokaJabs.listen("onchange", on_change))
		use(MaokaJabs.set_class("checkbox"))

		if (checked) use(MaokaJabs.set_attribute("checked"))
	})
