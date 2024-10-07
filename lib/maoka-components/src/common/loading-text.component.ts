import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const LoadingText = Maoka.create("span", ({ use }) => {
	const { t } = use(MaokaOrdo.Jabs.Translations)

	return () => t("t.common.state.loading")
})
