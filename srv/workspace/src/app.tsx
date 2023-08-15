import type { Hosts } from "$streams/auth"
import { Either } from "#lib/either/mod"
import { useOnAuthenticated } from "$hooks/use-on-authenticated"
import { useAppInit } from "$hooks/use-app-init"
import ActivityBar from "$components/activity-bar/activity-bar"
import ContextMenu from "$components/context-menu/context-menu"
import Workspace from "$components/workspace"
import Modal from "$components/modal"
import Null from "$components/null"
import { getCommands } from "$streams/commands"
import { useSubscription } from "$hooks/use-subscription"

const commands = getCommands()

export default function App(hosts: Hosts) {
	const streams = useAppInit(hosts)
	useOnAuthenticated(hosts)

	const contextMenu = useSubscription(streams.contextMenu$)

	const hideContextMenu = () => contextMenu && commands.emit("context-menu.hide")

	return Either.fromNullable(streams)
		.chain(() => Either.fromNullable(streams.contextMenu$))
		.chain(() => Either.fromNullable(streams.modal$))
		.chain(() => Either.fromNullable(streams.globalCommandPalette$))
		.chain(() => Either.fromNullable(streams.sidebar$))
		.map(() => streams as { [K in keyof typeof streams]: NonNullable<(typeof streams)[K]> }) // TODO: Extract to tau
		.fold(Null, ({ contextMenu$, modal$, globalCommandPalette$, sidebar$ }) => (
			<div className="flex" onClick={hideContextMenu}>
				<ActivityBar sidebar$={sidebar$} commandPalette$={globalCommandPalette$} />
				<Workspace sidebar$={sidebar$} commandPalette$={globalCommandPalette$} />
				<ContextMenu menu$={contextMenu$} />
				<Modal modal$={modal$} />
			</div>
		))
}
