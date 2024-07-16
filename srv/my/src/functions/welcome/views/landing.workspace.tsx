import { THosts } from "@ordo-pink/core"

import CorePrinciples from "../sections/core-principles.section"
import IndexHeroSection from "../sections/hero.section"
import RequestAccess from "../sections/request-access.section"

type P = { commands: Client.Commands.Commands; hosts: THosts }
export default function LandingWorkspace({ commands, hosts }: P) {
	commands.emit<cmd.application.set_title>("application.set_title", {
		window_title: "Единое пространство для документов, файлов и проектов",
		status_bar_title: "Мы не используем куки! Стоп, что?!",
	})

	return (
		<div className="overflow-y-visible">
			<IndexHeroSection static_host={hosts.static} />
			<CorePrinciples static_host={hosts.static} />
			<RequestAccess />
		</div>
	)
}
