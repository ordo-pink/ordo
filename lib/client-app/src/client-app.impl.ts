/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { bs_envelope_at, bs_question_circle, bs_telegram } from "@ordo-pink/frontend-icons"
import { aist } from "@ordo-pink/oss-aist"
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
	const router = aist.create(window)
	const translator = i18n.create_i18n("en")
	const activities$ = zags.create<OrdoClient.Activity.State>({ activities: { items: [] } })
	const data$ = zags.create<OrdoClient.Data.State>({ data: { root: {}, vaults: {} } })
	const query: OrdoClient.F.Query = router.$.concat(translator.$).concat(activities$).concat(data$).to_readable()
	const state = { name: "ordo_main", fetch, hunter, logger, query }

	use(ordo_client_maoka.context.provide(state))

	use(ordo_client_maoka.jabs.set_id("app"))
	use(ordo_client_maoka.jabs.add_translations("en", en))
	use(i18n_commands(translator))
	use(data_commands(data$, data_repository))
	use(activity_commands(activities$, router))
	use(
		ordo_client_maoka.jabs.add_command_palette_item(
			"cp_support_name",
			() =>
				hunter.shoot("ordo_main.command_palette.show", {
					items: [
						{
							id: "telegram",
							readable_name: "Telegram",
							value: "https://t.me/ordo_pink",
							hotkey: "t",
							render_icon: span => maoka_dom.render(span, bs_telegram(), ordo.uuid.create),
						},
						{
							id: "email",
							readable_name: "Email",
							value: "mailto:support@ordo.pink",
							hotkey: "e",
							render_icon: span => maoka_dom.render(span, bs_envelope_at(), ordo.uuid.create),
						},
					],
					on_select: item => {
						hunter.shoot("ordo_main.router.set_href", item.value)
						hunter.shoot("ordo_main.command_palette.hide")
					},
				}),
			{
				description: "cp_support_description",
				render_icon: span => maoka_dom.render(span, bs_question_circle(), ordo.uuid.create),
				type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.INFORMATION,
				hotkey: "mod+shift+h",
			},
		),
	)

	hunter.shoot("ordo_main.title.set_title", "loading")

	// TODO Separate user functions (installed globally, installed locally, got but not installed)
	// TODO Load installed user functions
	await import("./fs/filet/filet.impl")
		.then(module => module.default)
		.then(creator => creator(state))
		.catch(rrr => hunter.shoot("ordo_main.notification.rrr", rrr))

	// TODO Merge diffs among different repositories
	await data_repository
		.read()
		.pipe(oath.ops.map(data => data$.update("data.root", () => data ?? {})))
		.cata(oath.catas.or_else(e => hunter.shoot("ordo_main.notification.rrr", e)))

	// TODO Social networks via CP
	// TODO Breadcrumbs -> Quick Search
	// TODO Content storage
	// TODO Vaults
	// TODO Installed Functions
	// TODO Check permissions
	// TODO File Associations
	// TODO Ediot (Rich text editing)
	// TODO Move styles from client-app to Ediot
	// TODO Ediot sidebar
	// TODO Filet ancestor link outline
	// TODO Filet file upload + drag'n'drop
	// TODO Ediot file upload + drag'n'drop
	// TODO PDF FA
	// TODO Image FA
	// TODO Label helpers
	// TODO Link helpers
	// TODO Access
	// TODO Fields
	// TODO Filet CP create/delete/rename/move/labels/links/access/fields
	// TODO Landing page
	// TODO Dropdown menu
	// TODO 404
	// TODO Translations for error reasons and titles

	// TODO F Data Files
	// TODO Filet recent files
	// TODO Async for other intensive hooks
	// TODO Ediot collapse/expand history
	// TODO Ediot undo/redo history
	// TODO Filet favourite files
	// TODO Achievements
	// TODO Settings

	// TODO Scope translations to f
	// TODO F Store
	// TODO Docs!
	// TODO Live sharing
	// TODO Auth
	// TODO Get proper author when auth is ready
	// TODO Inherit permissions and group from parent on creation
	// TODO Data sync
	// TODO User Info
	// TODO Avatars

	// TODO Access sharing
	// TODO Public sharing

	// TODO Workspace tiling
	// TODO Notification history
	// TODO Background processes
	// TODO Activity Panel
	// TODO Store translations as Content
	// TODO Command palette access via router
	// TODO Modal access via router

	// TODO Billing + Payments

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

const en = {
	logo: "ORDO",
	loading: "Loading...",
	ordo_main_move_modal_move_to_root: "Move to root directory",
	cp_support_name: "Support...",
	cp_support_description: "Ask our support if you have any questions or problems.",
}
