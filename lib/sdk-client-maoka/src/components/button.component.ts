/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/oss-maoka"

import type * as ClientMaoka from "../sdk-client-maoka.types"
import { actionable_hotkey } from "./hotkey.component"

import "./button.styles.css"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"

export const button_success = (params: ClientMaoka.Components.ButtonArgs) =>
	default_button({ ...params, custom_class: add_button_type_class("success", params.custom_class) })

export const button_neutral = (params: ClientMaoka.Components.ButtonArgs) =>
	default_button({ ...params, custom_class: add_button_type_class("neutral", params.custom_class) })

export const button_primary = (params: ClientMaoka.Components.ButtonArgs) =>
	default_button({ ...params, custom_class: add_button_type_class("primary", params.custom_class) })

export const button_danger = (params: ClientMaoka.Components.ButtonArgs) =>
	default_button({ ...params, custom_class: add_button_type_class("danger", params.custom_class) })

// --- Internal ---

const text_container = maoka_styled.div()

const default_button = maoka.create<ClientMaoka.Components.ButtonArgs>(
	"button",
	({ kindergarten, on_click, aria_label = "", custom_class = "", hotkey: hotkey_args, use, node, disabled }) => {
		use(client_maoka.jabs.classes.set("button", custom_class))
		use(client_maoka.jabs.set_attribute("aria-label", aria_label))
		if (disabled) use(client_maoka.jabs.set_attribute("disabled"))

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			if (maoka_dom.node_guard(node)) node.value.focus()
			return on_click(event)
		}

		use(client_maoka.jabs.listen("onclick", handle_click))

		return () => [
			text_container(() => kindergarten()),
			hotkey_args && actionable_hotkey(typeof hotkey_args === "string" ? { hotkey: hotkey_args } : hotkey_args),
		]
	},
)

const add_button_type_class = (type: string, custom_class?: string): string => {
	if (!custom_class) return type

	return `${type} ${custom_class}`
}
