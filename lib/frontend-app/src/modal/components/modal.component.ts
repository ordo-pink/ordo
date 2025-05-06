import { maoka, maoka_dom } from "@ordo-pink/maoka"
import { MODAL_SIZE } from "@ordo-pink/core"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { sweech } from "@ordo-pink/sweech"

import { modal$ } from "../modal.state"

export const modal = maoka.create("div", ({ use }) => {
	let onunmount: (() => void) | undefined

	const get_modal_instance = use(maoka_jabs.cheat$(modal$, "instance"))

	use(maoka_jabs.set_class("modal"))

	return () => {
		const modal_instance = get_modal_instance()

		if (onunmount) onunmount()

		if (modal_instance) {
			if (modal_instance.onunmount) onunmount = modal_instance.onunmount
			if (modal_instance.size != null) use(maoka_jabs.add_class(internal.modal_size_to_class(modal_instance.size)))
			void use(maoka_dom.jabs.if_dom(n => modal_instance.render(n.value as HTMLDivElement)))
		} else return null
	}
})

namespace internal {
	export const modal_size_to_class = (size: MODAL_SIZE) =>
		sweech
			.match(size)
			.case(MODAL_SIZE.SM, () => "sm")
			.case(MODAL_SIZE.MD, () => "md")
			.case(MODAL_SIZE.LG, () => "lg")
			.case(MODAL_SIZE.XL, () => "xl")
			.default(() => "2xl")
}
