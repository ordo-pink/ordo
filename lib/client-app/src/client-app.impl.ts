/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { aist } from "@ordo-pink/oss-aist"
import { hunt } from "@ordo-pink/oss-hunt"
import { i18n } from "@ordo-pink/oss-i18n"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"
import { zags } from "@ordo-pink/oss-zags"

import type * as ClientApp from "./client-app.types"
import { command_palette, command_palette_toggle } from "./components/command-palette/command-palette.component"
import { sidebar, sidebar_toggle, workspace } from "./components/main/main.component"
import { activity_bar } from "./components/activity-bar/activity-bar.component"
import { activity_commands } from "./jabs/activity-commands.jab"
import { background_task_status } from "./components/background-task-indicator/background-task-indicator.component"
import { breadcrumbs } from "./components/breadcrumbs/breadcrumbs.component"
import { data_commands } from "./jabs/data-commands.jab"
import { i18n_commands } from "./jabs/i18n-commands.jabs"
import { modal } from "./components/modal/modal.component"
import { notifications } from "./components/notifications/notifications.component"
import { ordo_logo } from "./components/logo/logo.component"
import { titan_panel } from "./components/titan-panel/titan-panel.component"
import { title } from "./components/title/title.component"
import { user } from "./components/user/user.component"

import "./client-app.styles.css"

export const create = maoka.create<ClientApp.Args>("div", async ({ use, fetch, data_repository }) => {
	const logger = ordo.logger
	const hunter: OrdoClient.Command.Hunter = hunt.create(ordo.logger.debug)
	const router = aist.create(window)
	const translator = i18n.create_i18n("en")
	const activities$ = zags.create<OrdoClient.Activity.State>({ activities: { items: [] } })
	const data$ = zags.create<OrdoClient.Data.State>({ data: { root: {}, vaults: {} } })
	const query: OrdoClient.F.Query = router.$.concat(translator.$).concat(activities$).concat(data$).to_readable()
	const state = { fetch, hunter, logger, query }

	use(ordo_client_maoka.context.provide(state))
	use(ordo_client_maoka.jabs.set_id("app"))
	use(ordo_client_maoka.jabs.add_translations("en", en))

	use(i18n_commands(translator))
	use(data_commands(data$, data_repository))
	use(activity_commands(activities$, router))

	hunter.shoot("title.set_title", "loading")

	await data_repository
		.read()
		.pipe(oath.ops.map(data => data$.update("data.root", () => data ?? {})))
		.cata(oath.catas.or_else(e => hunter.shoot("notification.rrr", e)))

	await import("./fs/filet/filet.impl")
		.then(module => module.default)
		.then(creator => creator(state))
		.catch(rrr => hunter.shoot("notification.rrr", rrr))

	// TODO Filet workspace
	// TODO Prefix all main commands with "ordo.main"
	// TODO Async for other intensive hooks
	// TODO 404 (+ achievement)
	// TODO [BUG] Command palette does not sort items by item type
	// TODO Landing page (+ hidden achievement with the arrow)
	// TODO Label helpers (+ achievements)
	// TODO Link helpers (+ achievements)
	// TODO Move/rename/create/delete file
	// TODO Breadcrumbs -> Quick Search (+ achievements)
	// TODO Content storage
	// TODO Filet file upload + drag'n'drop (+ achievement)
	// TODO File Associations
	// TODO Ediot (Rich text editing) (+ achievement Dostoyevsky)
	// TODO Installed Functions (+ achievement)
	// TODO PDF FA
	// TODO Image FA
	// TODO Ediot sidebar
	// TODO Ediot file upload + drag'n'drop (+ achievement)
	// TODO Support via CP (+ achievement)
	// TODO Social networks via CP (+ achievement)
	// TODO Docs!

	// TODO F Data Files
	// TODO Filet recent files
	// TODO Ediot collapse/expand history
	// TODO Ediot undo/redo history (+ achievement)
	// TODO Filet favourite files (+ achievement)
	// TODO Achievements
	// TODO Settings (+ achievement)

	// TODO F Store
	// TODO Live sharing (+ achievement)
	// TODO Auth (+ achievement)
	// TODO Data sync
	// TODO User Info (+ achievement)
	// TODO Avatars (+ achievement)

	// TODO Access sharing (+ achievement)
	// TODO Public sharing (+ achievement)

	// TODO Billing (+ achievement)

	// TODO Notification history (+ achievement)
	// TODO Background processes (+ achievement)
	// TODO Activity Panel (+ achievement)
	// TODO Store translations as Content
	// TODO Command palette access via router
	// TODO Modal access via router

	return () => [
		title(),
		workspace_wrapper(() => [workspace(), sidebar()]),
		titan_panel(() => [logo_wrapper(() => [ordo_logo(), background_task_status()]), breadcrumbs(), user()]),
		activity_bar({ command_palette_toggle, sidebar_toggle }),
		modal(),
		command_palette(),
		notifications(),
	]
})

// --- Internal ---

const logo_wrapper = maoka_styled.div("logo-wrapper")
const workspace_wrapper = maoka_styled.div("workspace-wrapper")

const en = { logo: "ORDO", loading: "Loading..." }
