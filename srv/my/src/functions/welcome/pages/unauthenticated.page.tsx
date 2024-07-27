import { useEffect } from "react"

import { use$ } from "@ordo-pink/frontend-react-hooks"

import CorePrinciples from "../sections/core-principles.section"
import IndexHeroSection from "../sections/hero.section"
import RequestAccess from "../sections/request-access.section"

export default function UnauthenticatedPage() {
	const commands = use$.commands()

	const translate = use$.scoped_translation("pink.ordo.welcome")

	const t_title = translate("title")
	const t_cookies_warning = translate("cookies_warning")

	useEffect(() => {
		commands.emit<cmd.application.set_title>("application.set_title", {
			window_title: t_title,
			status_bar_title: t_cookies_warning,
		})
	}, [commands, t_title, t_cookies_warning])

	return (
		<div className="overflow-y-visible">
			<IndexHeroSection />
			<CorePrinciples />
			<RequestAccess />
		</div>
	)
}
