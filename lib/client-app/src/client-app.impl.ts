/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Colonoscope, colonoscope } from "@ordo-pink/oss-colonoscope"
import { aist } from "@ordo-pink/oss-aist"
import { bs_check_circle } from "@ordo-pink/frontend-icons"
import { hunt } from "@ordo-pink/oss-hunt"
import { i18n } from "@ordo-pink/oss-i18n"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"
import { zags } from "@ordo-pink/oss-zags"

import type * as ClientApp from "./client-app.types"
import { command_palette, command_palette_toggle } from "./command-palette/command-palette.component"
import { sidebar, sidebar_toggle, workspace } from "./main/main.component"
import { activity_bar } from "./activity-bar/activity-bar.component"
import { background_task_status } from "./background-task-indicator/background-task-indicator.component"
import { breadcrumbs } from "./breadcrumbs/breadcrumbs.component"
import { modal } from "./modal/modal.component"
import { notifications } from "./notifications/notifications.component"
import { ordo_logo } from "./logo/logo.component"
import { titan_panel } from "./titan-panel/titan-panel.component"
import { title } from "./title/title.component"
import { user } from "./user/user.component"

import "./client-app.styles.css"

export const create = maoka.create<ClientApp.Args>("div", ({ use, fetch }) => {
	const logger = ordo.logger
	const hunter: OrdoClient.Command.Hunter = hunt.create(ordo.logger.debug)
	const aist$ = aist.create(window)
	const i18n$ = i18n.create_i18n("en")
	const activities$ = zags.create<OrdoClient.Activity.State>({ activities: { items: [] } })
	const query: OrdoClient.Query = aist$.$.concat(i18n$.$).concat(activities$).to_readable()

	const handle_onmount = () => {
		const divorce_rotor = aist$.$.cheat("aist.pathname", pathname => {
			const items = activities$.select("activities.items")

			activities$.update("activities.current", () => {
				let params: Colonoscope.Results = null

				const item = items.find(item => {
					for (const route of item.routes) {
						if (colonoscope.is_doctor(route)) {
							const results = colonoscope.check(route, pathname)

							if (results) {
								params = results
								return true
							}
						}
						if (route === pathname) {
							return true
						}
					}

					return false
				})

				return item && { ...item, params }
			})
		})

		hunter.shoot("title.set_title", "loading")
		hunter.shoot("i18n.add_translations", { locale: "en", values: { logo: "ORDO", loading: "Loading..." } })
		hunter.shoot("activity.register", {
			id: "test",
			readable_name: "Test",
			routes: ["/test"],
			render_icon: div => void maoka_dom.render(div, bs_check_circle(), () => crypto.randomUUID()),
			render_workspace: div =>
				void maoka_dom.render(div, maoka.create("div", () => () => "HELLO WORKSPACE")(), () => crypto.randomUUID()),
			render_sidebar: div =>
				void maoka_dom.render(div, maoka.create("div", () => () => "HELLO SIDEBAR")(), () => crypto.randomUUID()),
		})

		return () => {
			divorce_rotor()

			hunter.shoot("i18n.remove_translations", ["logo", "loading"])
		}
	}

	const handle_set_search: OrdoClient.Command.GunFor<"router.set_search"> = s =>
		ordo.validations.is_string(s) ? aist$.set_search(s) : aist$.set_search_params(s)

	const handle_register_activity: OrdoClient.Command.GunFor<"activity.register"> = item => {
		activities$.update("activities.items", items => (items.some(i => i.id === item.id) ? items : items.concat(item)))

		const pathname = aist$.$.select("aist.pathname")

		for (const route of item.routes) {
			if (colonoscope.is_doctor(route)) {
				const params = colonoscope.check(route, pathname)
				activities$.update("activities.current", () => ({ ...item, params }))
				break
			} else if (route === pathname) {
				activities$.update("activities.current", () => ({ ...item, params: null }))
				break
			}
		}
	}

	const handle_unregister_activity: OrdoClient.Command.GunFor<"activity.unregister"> = id => {
		activities$.update("activities.items", items => items.filter(i => i.id !== id))
	}

	const handle_set_href: OrdoClient.Command.GunFor<"router.set_href"> = href => void open(href, "_blank")?.focus()

	const handle_add_translations: OrdoClient.Command.GunFor<"i18n.add_translations"> = ({ locale, values }) =>
		i18n$.add(locale, values)

	use(ordo_client_maoka.context.provide({ fetch, hunter, logger, query }))
	use(maoka_dom.jabs.onmount(() => handle_onmount()))
	use(ordo_client_maoka.jabs.set_id("app"))
	use(ordo_client_maoka.jabs.handle_command("activity.register", handle_register_activity))
	use(ordo_client_maoka.jabs.handle_command("activity.unregister", handle_unregister_activity))
	use(ordo_client_maoka.jabs.handle_command("i18n.add_translations", handle_add_translations))
	use(ordo_client_maoka.jabs.handle_command("i18n.remove_translations", i18n$.remove))
	use(ordo_client_maoka.jabs.handle_command("i18n.set_locale", i18n$.set_locale))
	use(ordo_client_maoka.jabs.handle_command("router.set_hash", aist$.set_hash))
	use(ordo_client_maoka.jabs.handle_command("router.set_href", handle_set_href))
	use(ordo_client_maoka.jabs.handle_command("router.set_pathname", aist$.set_pathname))
	use(ordo_client_maoka.jabs.handle_command("router.set_search", handle_set_search))

	// TODO Data storage
	// TODO Content storage
	// TODO Breadcrumbs
	// TODO Quick Search
	// TODO Settings
	// TODO Activities
	// TODO Notification history
	// TODO File Associations
	// TODO Installed Functions
	// TODO Fs
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
