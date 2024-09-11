import { create } from "@ordo-pink/maoka"
import { get_translations } from "@ordo-pink/maoka-ordo-hooks"
import { is_fn } from "@ordo-pink/tau"

export const LoadingText = create("span", ({ use }) => {
	const translate = use(get_translations)

	return is_fn(translate) ? translate("t.common.state.loading") : "Loading..."
})
