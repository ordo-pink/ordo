/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { aist } from "@ordo-pink/oss-aist"
import { bs_check_circle } from "@ordo-pink/frontend-icons"
import { hunt } from "@ordo-pink/oss-hunt"
import { i18n } from "@ordo-pink/oss-i18n"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
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
	const aist$ = aist.create(window)
	const i18n$ = i18n.create_i18n("en")
	const activities$ = zags.create<OrdoClient.Activity.State>({ activities: { items: [] } })
	const data$ = zags.create<OrdoClient.Data.State>({ root: {}, vaults: {} })
	const query: OrdoClient.Query = aist$.$.concat(i18n$.$).concat(activities$).concat(data$).to_readable()

	await data_repository
		.read()
		.cata({ reject: e => hunter.shoot("notification.rrr", e), resolve: data => data$.update("root", () => data ?? {}) })

	hunter.shoot("title.set_title", "loading")
	hunter.shoot("activity.register", {
		id: "test",
		readable_name: "Test",
		routes: ["/test"],
		render_icon: div => void maoka_dom.render(div, bs_check_circle(), ordo.uuid.create),
		render_workspace: div => void maoka_dom.render(div, maoka.create("div", () => () => "HELLO WORKSPACE")(), ordo.uuid.create),
		render_sidebar: div => void maoka_dom.render(div, maoka.create("div", () => () => "HELLO SIDEBAR")(), ordo.uuid.create),
	})

	use(ordo_client_maoka.context.provide({ fetch, hunter, logger, query }))
	use(ordo_client_maoka.jabs.set_id("app"))
	use(ordo_client_maoka.jabs.add_translations("en", en))

	use(i18n_commands(i18n$))
	use(data_commands(data$, data_repository))
	use(activity_commands(activities$, aist$))

	// TODO Fs
	// TODO Breadcrumbs
	// TODO Content storage
	// TODO Quick Search
	// TODO Notification history
	// TODO File Associations
	// TODO Installed Functions
	// TODO Settings
	// TODO F Data Files
	// TODO 404
	// TODO Rich Text Editor
	// TODO File Uploading
	// TODO PDF FA
	// TODO Image FA
	// TODO Drag'n'drop
	// TODO F Store
	// TODO Live sharing
	// TODO Auth
	// TODO User Info
	// TODO Avatars
	// TODO Data sync
	// TODO Public sharing
	// TODO Access sharing
	// TODO Billing
	// TODO Achievements
	// TODO Background processes
	// TODO Activity Panel
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
