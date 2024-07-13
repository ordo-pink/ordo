// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { ErrorInfo, useEffect } from "react"
import Helmet from "react-helmet"

import {
	__init_ordo_context,
	useCommands,
	useLogger,
	useStrictSubscription,
	useSubscription,
} from "@ordo-pink/frontend-react-hooks"
import { Oath } from "@ordo-pink/oath"
import { TOrdoContext } from "@ordo-pink/core"
import { currentActivity$ } from "@ordo-pink/frontend-stream-activities"
import { fromNullableE } from "@ordo-pink/either"
import { useAppInit } from "@ordo-pink/frontend-app-init"

import ActivityBar from "@ordo-pink/frontend-react-sections/activity-bar"
import BackgroundTaskIndicator from "@ordo-pink/frontend-react-sections/background-task-indicator"
import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"
import ContextMenu from "@ordo-pink/frontend-react-sections/context-menu/context-menu.component"
import ErrorBoundary from "@ordo-pink/frontend-react-components/error-boundary"
import Link from "@ordo-pink/frontend-react-components/link"
import Loader from "@ordo-pink/frontend-react-components/loader"
import Loading from "@ordo-pink/frontend-react-components/loading-page"
import Modal from "@ordo-pink/frontend-react-sections/modal"
import Notifications from "@ordo-pink/frontend-react-sections/notifications"
import Workspace from "@ordo-pink/frontend-react-sections/workspace"

const QueryContextProvider = __init_ordo_context()

// TODO: Take import source from ENV
// TODO: Remove $ imports
type P = { app_context: TOrdoContext }
export default function App({ app_context }: P) {
	const commands = useCommands()
	const currentActivity = useSubscription(currentActivity$)
	const logger = useLogger()

	const title = useStrictSubscription(app_context.streams.title$, "Ordo.pink")

	useAppInit() // TODO: Put useAppInit contents back to the App component

	const log_error = (error: Error, info: ErrorInfo) => {
		logger.error(error)
		logger.error(info.componentStack)
	}

	useEffect(() => {
		void Oath.Resolve(commands)
			.chain(() =>
				Oath.FromPromise(() => import("@ordo-pink/function-home")).chain(module =>
					Oath.FromPromise(async () => await module.default),
				),
			)
			.chain(() =>
				Oath.FromPromise(() => import("@ordo-pink/function-file-explorer")).chain(module =>
					Oath.FromPromise(async () => await module.default),
				),
			)
			.chain(() =>
				Oath.FromPromise(() => import("@ordo-pink/function-gtd")).chain(module =>
					Oath.FromPromise(async () => await module.default),
				),
			)
			.chain(() =>
				Oath.FromPromise(() => import("@ordo-pink/function-links")).chain(module =>
					Oath.FromPromise(async () => await module.default),
				),
			)
			.chain(() =>
				Oath.FromPromise(() => import("@ordo-pink/function-editor")).chain(module =>
					Oath.FromPromise(async () => await module.default),
				),
			)
			.chain(() =>
				Oath.FromPromise(() => import("@ordo-pink/function-user")).chain(module =>
					Oath.FromPromise(async () => await module.default),
				),
			)
			.chain(() =>
				Oath.FromPromise(() => import("@ordo-pink/function-achievements")).chain(module =>
					Oath.FromPromise(async () => await module.default),
				),
			)
			.chain(() =>
				Oath.FromPromise(() => import("@ordo-pink/function-excalidraw")).chain(module =>
					Oath.FromPromise(async () => await module.default),
				),
			)
			.invoke(Oath.invokers.or_nothing)

		return () => {
			commands.emit<cmd.commandPalette.remove>("command-palette.remove", "command-palette.hide")
		}
	}, [commands])

	return fromNullableE(currentActivity).fold(Loading, () => (
		<ErrorBoundary logError={log_error} fallback={<Fallback />}>
			<QueryContextProvider value={app_context}>
				<Helmet>
					<title>{title}</title>
				</Helmet>

				<div className="flex">
					<ActivityBar />
					<Workspace />
				</div>

				<Notifications />
				<ContextMenu />
				<BackgroundTaskIndicator />
				<Modal />
			</QueryContextProvider>
		</ErrorBoundary>
	))
}

// --- Internal ---

const Fallback = () => (
	<div className="bg-neutral-800">
		<CenteredPage centerX centerY>
			<div className="flex h-screen w-full flex-col items-center justify-center space-y-4">
				<Loader size="l"></Loader>
				<p>
					Возможно, что-то пошло не так. Может, <Link href="/">на главную</Link>?
				</p>
			</div>
		</CenteredPage>
	</div>
)
