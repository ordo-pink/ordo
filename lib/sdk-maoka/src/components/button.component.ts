/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"

import { MaokaSDK } from "../sdk-maoka.types"
import { actionable_hotkey } from "./hotkey.component"

import "./button.styles.css"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

export const button_success = (params: MaokaSDK.Components.ButtonArgs) =>
	default_button({ ...params, custom_class: add_button_type_class("success", params.custom_class) })

export const button_neutral = (params: MaokaSDK.Components.ButtonArgs) =>
	default_button({ ...params, custom_class: add_button_type_class("neutral", params.custom_class) })

export const button_primary = (params: MaokaSDK.Components.ButtonArgs) =>
	default_button({ ...params, custom_class: add_button_type_class("primary", params.custom_class) })

export const button_danger = (params: MaokaSDK.Components.ButtonArgs) =>
	default_button({ ...params, custom_class: add_button_type_class("danger", params.custom_class) })

// --- Internal ---

const text_container = maoka_styled.div()

const default_button = maoka.create<MaokaSDK.Components.ButtonArgs>(
	"button",
	({ kindergarten, on_click, aria_label = "", custom_class = "", hotkey: hotkey_args, use, node, disabled }) => {
		use(maoka_sdk.jabs.classes.set("button", custom_class))
		use(maoka_sdk.jabs.set_attribute("aria-label", aria_label))
		if (disabled) use(maoka_sdk.jabs.set_attribute("disabled"))

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			if (maoka_dom.guards.is_dom_node(node)) node.value.focus()
			return on_click(event)
		}

		use(maoka_sdk.jabs.listen("onclick", handle_click))

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
