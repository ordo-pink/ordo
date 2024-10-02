import { Maoka } from "@ordo-pink/maoka"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"

export const LoadingText = Maoka.create("span", ({ use }) => {
	const { t } = use(OrdoHooks.translations)

	return () => t("t.common.state.loading")
})
