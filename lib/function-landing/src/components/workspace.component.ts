/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { NOTIFICATION } from "@ordo-pink/sdk-client"
import { bs_cookie } from "@ordo-pink/frontend-icons"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { create_component } from "@ordo-pink/oss-maoka"
import { maoka_styled } from "@ordo-pink/oss-maoka/styled"

import hero_layer_0 from "../../static/index-hero-layer-0.png"
import hero_layer_1 from "../../static/index-hero-layer-1.png"
import hero_layer_2 from "../../static/index-hero-layer-2.png"

import "../f-landing.styles.css"

let is_cookie_modal_shown = false

// TODO Translations
export const workspace = create_component.create("div", ({ use, node }) => {
	const { hunter } = use(client_maoka.context.consume)

	const t_bring_your_thoughts_to = "Bring your thoughts to"
	const t_ordo = "ORDO"

	const t_beta_started = use(client_maoka.jabs.translate$("fns_landing_cta_announcement"))
	const t_learn_more = use(client_maoka.jabs.translate$("fns_landing_buttons_learn_more"))
	const t_try_now = use(client_maoka.jabs.translate$("fns_landing_buttons_try_now"))
	const t_join = use(client_maoka.jabs.translate$("fns_landing_buttons_join"))

	const handle_mouse_move = (event: MouseEvent) => {
		const dx = (event.clientX - window.innerWidth / 2) * -0.005
		const dy = (event.clientY - window.innerHeight / 2) * -0.01
		const style = `--move-x: ${dx}deg; --move-y: ${dy}deg;`

		Object.assign(document.documentElement, { style })
	}

	const handle_onmount = () => {
		hunter.shoot("title.set_title", "fns_landing_title")

		if (!is_cookie_modal_shown) {
			is_cookie_modal_shown = true

			const component = bs_cookie({ classes: "cookie-notification_icon" })

			hunter.shoot("notifications.show", {
				duration: 15,
				message: "fns_landing_cookie_notification_message",
				render_icon: element => create_component.dom.render(element, component, node.root.create_id),
				title: "fns_landing_cookie_notification_title",
				type: NOTIFICATION.TYPE.WARN,
			})
		}

		return () => void Object.assign(document.documentElement, { style: "" })
	}

	use(client_maoka.jabs.listen_global_event("mousemove", handle_mouse_move))
	use(create_component.dom.jabs.onmount(handle_onmount))

	const handle_join_click = () => void hunter.shoot("user.show_request_code_modal")
	const handle_more_click = () => console.log("HERE")
	const handle_try_click = () => console.log("THERE")

	return () => {
		return hero_section(() => [
			hero_section_layers(() => [
				// Floating hero section images
				hero_section_image_layer({ image_path: hero_layer_0, index: 0 }),
				hero_section_image_layer({ image_path: hero_layer_1, index: 1 }),
				hero_section_image_layer({ image_path: hero_layer_2, index: 2 }),
			]),
			hero_card(() =>
				hero_card_content(() => [
					HeroCardLogoSection(() => [
						HeroCardLogoWrapper(() => [t_bring_your_thoughts_to, HeroCardLogoText(() => t_ordo)]),
						HeroCardLogoAction(() =>
							client_maoka.components.button.neutral({
								hotkey: { hotkey: "m", prevent_in_inputs: true },
								kindergarten: t_learn_more,
								on_click: handle_more_click,
							}),
						),
					]),
					call_to_action_section(() =>
						call_to_action_card(() => [
							call_to_action_beta_logo(() => `"${t_beta_started()}"`),
							actions_container(() => [
								client_maoka.components.button.neutral({
									hotkey: { hotkey: "mod+enter", prevent_in_inputs: true },
									kindergarten: t_try_now,
									on_click: handle_try_click,
								}),
								client_maoka.components.button.primary({
									kindergarten: t_join,
									on_click: handle_join_click,
									hotkey: { hotkey: "mod+j", prevent_in_inputs: true },
								}),
							]),
						]),
					),
				]),
			),
		])
	}
})

// --- Internal ---

const hero_section = maoka_styled.tags.section("hero-section")
const hero_section_layers = maoka_styled.tags.div("hero-layers")

const hero_section_image_layer = create_component.create<{ image_path: string; index: number }>(
	"div",
	({ image_path, index, use }) => {
		const background_image = `url(${image_path})`

		use(client_maoka.jabs.classes.set(`hero-layer hero-layer_${index}`))
		use(client_maoka.jabs.set_style({ backgroundImage: background_image }))
	},
)
const hero_card = maoka_styled.tags.div("card-container")
const hero_card_content = maoka_styled.tags.div("card")
const HeroCardLogoText = maoka_styled.tags.span("logo_ordo-text")
const HeroCardLogoWrapper = maoka_styled.tags.h1("logo")
const HeroCardLogoSection = maoka_styled.tags.div("logo-section")
const HeroCardLogoAction = maoka_styled.tags.div("logo_action")

const actions_container = maoka_styled.tags.div("actions-container")

const call_to_action_section = maoka_styled.tags.div("cta")
const call_to_action_card = maoka_styled.tags.div("cta_card")
const cta_logo_wrapper = maoka_styled.tags.div()
const cta_beta_test = maoka_styled.tags.h3("cta_beta")
const beta_started_string = maoka_styled.tags.p("cta_beta_started")
const call_to_action_beta_logo = (t_beta_started: () => string) =>
	cta_logo_wrapper(() => [
		cta_beta_test(() => [
			token("token_keyword", "const "),
			token("token_variable", "teβt "),
			token("token_keyword", "= "),
			token("token_scope", "() "),
			token("token_keyword", "⇒"),
			beta_started_string(t_beta_started),
		]),
	])

const token = (cls: string, text: string) => maoka_styled.tags.span(cls)(() => text)
