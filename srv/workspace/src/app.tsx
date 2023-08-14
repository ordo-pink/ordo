import type { Hosts } from "$streams/auth"
import { Either } from "#lib/either/mod"
import { useOnAuthenticated } from "$hooks/use-on-authenticated"
import { useAppInit } from "$hooks/use-app-init"
import { useDefaultCommandPalette } from "$streams/command-palette"
import { getContextMenu } from "$streams/context-menu"
import ActivityBar from "$components/activity-bar/activity-bar"
import ContextMenu from "$components/context-menu/context-menu"
import Workspace from "$components/workspace"
import Modal from "$components/modal"
import Null from "$components/null"

const contextMenu = getContextMenu()

export default function App(hosts: Hosts) {
	const init = useAppInit(hosts)
	useOnAuthenticated(hosts)
	useDefaultCommandPalette()

	return Either.fromNullable(init.contextMenu$)
		.map(() => init as { [K in keyof typeof init]: NonNullable<(typeof init)[K]> }) // TODO: Extract to tau
		.fold(Null, ({ contextMenu$ }) => (
			<div className="flex" onClick={contextMenu.hide}>
				<ActivityBar />
				<Workspace />
				<ContextMenu menu$={contextMenu$} />
				<Modal />
			</div>
		))
}
