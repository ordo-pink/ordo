import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"

import { RTE } from "../rte"

export const QuickMenu = () =>
	StyledQuickMenu(({ use }) => {
		const get_quick_menu = use(
			MaokaOrdo.Jabs.happy_marriage$(RTE.$, state => {
				return state.quick_menu
			}),
		)

		return () => {
			const qm = get_quick_menu()

			if (qm) {
				use(MaokaJabs.add_class("active"))
				use(MaokaJabs.set_style({ left: `${qm.x}px`, top: `${qm.y}px` }))

				return "Here will be a quick menu when it's ready. Refresh the page to make it go away." // TODO
			} else {
				use(MaokaJabs.remove_class("active"))
			}
		}
	})

// --- Internal ---

const StyledQuickMenu = MaokaStyled.Tags.div("rte_quick-menu")
