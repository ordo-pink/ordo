import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"
import { is_fn } from "@ordo-pink/tau"

const span = create<TOrdoHooks>("span")

export const LoadingText = span(use => {
	const translate = use.get_translations && use.get_translations()

	return is_fn(translate) ? translate("t.common.state.loading") : "Loading..."
})
