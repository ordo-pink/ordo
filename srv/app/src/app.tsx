import type { Hosts } from "./streams/auth"

import { useAppInit } from "./hooks/use-app-init"
import { useOnAuthenticated } from "./hooks/use-on-authenticated"
import { useDefaultCommandPalette } from "./streams/command-palette"
import { useContextMenu } from "./streams/context-menu"
import ActivityBar from "./components/activity-bar/activity-bar"
import ContextMenu from "./components/context-menu/context-menu"
import Modal from "./components/modal"
import Workspace from "./components/workspace"

export default function App({ id, data, web }: Hosts) {
	useAppInit({ id, data, web })
	useOnAuthenticated({ id, data, web })
	useDefaultCommandPalette()

	const contextMenu = useContextMenu()

	return (
		<div className="flex" onClick={contextMenu.hide}>
			<ActivityBar />
			<Workspace />
			<ContextMenu />
			<Modal />
		</div>
	)
}
