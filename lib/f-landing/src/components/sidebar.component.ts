import { maoka, maoka_dom } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

export const sidebar = maoka.create("div", ({ use }) => {
	const { logger } = use(maoka_sdk.context.consume)

	logger.debug("sidebar created")

	use(
		maoka_dom.jabs.onmount(() => {
			logger.debug("sidebar mounted")

			return () => {
				logger.debug("sidebar unmounted")
			}
		}),
	)

	return () => {
		logger.debug("sidebar rendered")

		return "Sidebar!"
	}
})
