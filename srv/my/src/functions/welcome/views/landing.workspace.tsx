import CorePrinciples from "../sections/core-principles.section"
import IndexHeroSection from "../sections/hero.section"
import RequestAccess from "../sections/request-access.section"
import { useCommands } from "@ordo-pink/frontend-react-hooks"

export default function LandingWorkspace() {
	const commands = useCommands()

	commands.emit<cmd.application.set_title>("application.set_title", {
		window_title: "Единое пространство для документов, файлов и проектов",
		status_bar_title: "Мы не используем куки! Стоп, что?!",
	})

	return (
		<div className="overflow-y-visible">
			<IndexHeroSection />
			<CorePrinciples />
			<RequestAccess />
		</div>
	)
}
