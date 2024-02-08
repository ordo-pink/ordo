import { ErrorInfo, useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import { BsCommand } from "react-icons/bs"

import {
	currentCommandPalette$,
	globalCommandPalette$,
} from "@ordo-pink/frontend-stream-command-palette"
import {
	useCommands,
	useIsAuthenticated,
	useLogger,
	useSubscription,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { Oath } from "@ordo-pink/oath"
import { currentActivity$ } from "@ordo-pink/frontend-stream-activities"
import { noop } from "@ordo-pink/tau"

import ActivityBar from "@ordo-pink/frontend-react-sections/activity-bar"
import BackgroundTaskIndicator from "@ordo-pink/frontend-react-sections/background-task-indicator"
import CommandPaletteModal from "@ordo-pink/frontend-react-sections/command-palette"
import ContextMenu from "@ordo-pink/frontend-react-sections/context-menu/context-menu.component"
import ErrorBoundary from "@ordo-pink/frontend-react-components/error-boundary"
import Loading from "@ordo-pink/frontend-react-components/loading-page"
import Modal from "@ordo-pink/frontend-react-sections/modal"
import Notifications from "@ordo-pink/frontend-react-sections/notifications"
import Null from "@ordo-pink/frontend-react-components/null"
import Workspace from "@ordo-pink/frontend-react-sections/workspace"

import "./app.css"

const isDarwin = navigator.appVersion.indexOf("Mac") !== -1
const IGNORED_KEYS = ["Control", "Shift", "Alt", "Control", "Meta"]

// TODO: Take import source from ENV
export default function App() {
	const commands = useCommands()
	const isAuthenticated = useIsAuthenticated()
	const currentActivity = useSubscription(currentActivity$)
	const logger = useLogger()

	const commandPalette = useSubscription(currentCommandPalette$)

	const globalCommandPalette = useSubscription(globalCommandPalette$)

	useHotkeys(
		"*",
		e => {
			if (IGNORED_KEYS.includes(e.key)) return

			let hotkey = ""

			if (e.altKey) hotkey += "meta+"
			if (e.ctrlKey) hotkey += isDarwin ? "ctrl+" : "mod+"
			if (e.metaKey) hotkey += "mod+"
			if (e.shiftKey) hotkey += "shift+"

			hotkey += e.code.replace("Key", "").toLocaleLowerCase()

			const command = globalCommandPalette?.items.find(c => c.accelerator === hotkey)

			if (command) {
				e.preventDefault()
				e.stopPropagation()

				command.onSelect()
			}
		},
		{
			enableOnFormTags: true,
			enableOnContentEditable: true,
		},
		[globalCommandPalette],
	)

	const logError = (error: Error, info: ErrorInfo) => {
		logger.error(error)
		logger.error(info.componentStack)
	}

	useEffect(() => {
		Either.fromBoolean(() => isAuthenticated).fold(Null, () =>
			commands.emit<cmd.user.refreshInfo>("user.refresh"),
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated])

	useEffect(() => {
		Either.fromNullable(commandPalette)
			.chain(cp =>
				Either.fromBoolean(
					() =>
						cp.items.length > 0 ||
						(!!cp.pinnedItems && cp.pinnedItems.length > 0) ||
						!!cp.onNewItem,
					() => cp,
				),
			)
			.fold(noop, cp =>
				commands.emit<cmd.modal.show>("modal.show", {
					Component: () =>
						(
							<CommandPaletteModal
								items={cp.items}
								onNewItem={cp.onNewItem}
								multiple={cp.multiple}
								pinnedItems={cp.pinnedItems}
							/>
						) as any,
					// The onHide hook makes a redundant call for hiding modal, but helps with closing the
					// command palette when the modal is closed with a click on the overlay or Esc key press.
					options: {
						showCloseButton: false,
						onHide: () => commands.emit<cmd.commandPalette.hide>("command-palette.hide"),
					},
				}),
			)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [commandPalette])

	useEffect(() => {
		commands.emit<cmd.commandPalette.add>("command-palette.add", {
			id: "command-palette.hide",
			onSelect: () => commands.emit<cmd.commandPalette.hide>("command-palette.hide"),
			readableName: "Скрыть панель команд",
			Icon: BsCommand,
			accelerator: "mod+shift+p",
		})

		void Oath.of(commands)
			.chain(() =>
				Oath.from(() => import("@ordo-pink/function-test")).chain(f =>
					Oath.from(async () => f.default),
				),
			)
			.chain(() =>
				Oath.from(() => import("@ordo-pink/function-user")).chain(f =>
					Oath.from(async () => f.default),
				),
			)
			.orNothing()

		return () => {
			commands.emit<cmd.commandPalette.remove>("command-palette.remove", "command-palette.hide")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// TODO: Next up :: update permissions
	return Either.fromNullable(currentActivity).fold(Loading, () => (
		<ErrorBoundary logError={logError} fallback={<Fallback />}>
			<div className="app">
				<ActivityBar />
				<Workspace />
			</div>

			<Notifications />
			<ContextMenu />
			<BackgroundTaskIndicator />
			<Modal />
		</ErrorBoundary>
	))
}

// --- Internal ---

const Fallback = () => <div>TODO</div> // TODO: Add error fallback
