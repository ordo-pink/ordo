import { maoka, maoka_styled } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

export const join_modal = maoka.create("div", ({ use }) => {
	use(maoka_jabs.set_class("auth_join-modal"))
	return () => [internal.title(() => "Join ORDO")]
})

namespace internal {
	export const title = maoka_styled.h1("auth_join-modal_title")
}
