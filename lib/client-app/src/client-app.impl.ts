/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { aist } from "@ordo-pink/oss-aist"
import { hunt } from "@ordo-pink/oss-hunt"
import { i18n } from "@ordo-pink/oss-i18n"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import type * as ClientApp from "./client-app.types"
import { background_task_status } from "./background-task-indicator/background-task-indicator.component"
import { breadcrumbs } from "./breadcrumbs/breadcrumbs.component"
import { details } from "./details/details.component"
import { notifications } from "./notifications/notifications.component"
import { ordo_logo } from "./logo/logo.component"
import { page_loading } from "./loading/loading.component"
import { status_bar } from "./status-bar/status-bar.component"
import { titan_panel } from "./titan-panel/titan-panel.component"
import { user } from "./user/user.component"

import "./client-app.styles.css"
import { title } from "./title/title.component"

export const create = maoka.create<ClientApp.Args>("div", ({ use, fetch }) => {
	const hunter: OrdoClient.Command.Hunter = hunt.create(ordo.logger.debug)
	const aist$ = aist.create(window)
	const i18n$ = i18n.create_i18n("en")
	const query: OrdoClient.Query = aist$.$.concat(i18n$.$).to_readable()

	use(ordo_client_maoka.jabs.set_id("app"))
	use(ordo_client_maoka.context.provide({ hunter, logger: ordo.logger, fetch, query }))

	use(maoka_dom.jabs.onmount(() => handle_onmount()))

	hunter.shoot("title.set_title", "loading")

	const handle_onmount = () => {
		// I18n commands
		const drop_add_translations = hunter.track("i18n.add_translations", ({ locale, values }) => i18n$.add(locale, values))
		const drop_remove_translations = hunter.track("i18n.remove_translations", i18n$.remove)
		const drop_set_locale = hunter.track("i18n.set_locale", i18n$.set_locale)

		// Aist commands
		const drop_set_hash = hunter.track("router.set_hash", aist$.set_hash)
		const drop_set_href = hunter.track("router.set_href", href => void open(href, "_blank")?.focus())
		const drop_set_pathname = hunter.track("router.set_pathname", aist$.set_pathname)
		const drop_set_search = hunter.track("router.set_search", x =>
			ordo.validations.is_string(x) ? aist$.set_search(x) : aist$.set_search_params(x),
		)

		hunter.shoot("i18n.add_translations", { locale: "en", values: { logo: "ORDO", loading: "Loading..." } })

		return () => {
			drop_add_translations()
			drop_remove_translations()
			drop_set_locale()

			drop_set_hash()
			drop_set_href()
			drop_set_pathname()
			drop_set_search()
		}
	}

	// TODO Fs
	// TODO Activities
	// TODO File Associations
	// TODO Auth
	// TODO Data sync

	// TODO F Store
	// TODO Achievements
	// TODO Drag'n'drop

	return () => {
		return [
			titan_panel(() => [
				ordo_logo(),
				breadcrumbs(),
				user(), // TODO User Info, Achievements, Installed Functions, Billing
				// TODO Settings
			]),
			main(() => [
				page_loading(),
				// TODO Workspace
				// TODO Sidebar
				// TODO Activity Bar (+ F Store)
			]),
			status_bar(() => [
				background_task_status(), // TODO Background processes
				details(), // TODO Activity & File Association details
				notifications(),
			]),
			// TODO Command Palette
			// TODO Notifications Stack
			// TODO Modal
			title(),
		]
	}
})

// --- Internal ---

const main = maoka_styled.main()
