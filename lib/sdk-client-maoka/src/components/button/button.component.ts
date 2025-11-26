/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import maoka, { type Maoka } from "@ordo-pink/oss-maoka"
import maoka_dom from "@ordo-pink/oss-maoka/dom"
import styled from "@ordo-pink/oss-maoka-styled"

import { add_class, set_class } from "../../jabs/class.jab"
import { actionable_hotkey } from "../hotkey/hotkey.component"
import { listen } from "../../jabs/listen.jab"
import { set_attribute } from "../../jabs/attribute.jab"

import "./button.styles.css"

export namespace button {
	export const success: OrdoClientMaoka.Components.Button.Component = params =>
		base({ ...params, custom_class: add_button_type_class("success", params.custom_class) })

	export const neutral: OrdoClientMaoka.Components.Button.Component = params =>
		base({ ...params, custom_class: add_button_type_class("neutral", params.custom_class) })

	export const primary: OrdoClientMaoka.Components.Button.Component = params =>
		base({ ...params, custom_class: add_button_type_class("primary", params.custom_class) })

	export const danger: OrdoClientMaoka.Components.Button.Component = params =>
		base({ ...params, custom_class: add_button_type_class("danger", params.custom_class) })
}

// --- Internal ---

const text_container = styled.div()

const base: OrdoClientMaoka.Components.Button.Component = maoka.create(
	"button",
	({ kindergarten, on_click, aria_label = "", custom_class = "", hotkey: hotkey_args, use, node, disabled, small }) => {
		use(set_class("button", custom_class))
		use(set_attribute("aria-label", aria_label))
		if (disabled) use(set_attribute("disabled"))
		if (small) use(add_class("small"))

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			if (maoka_dom.node_guard(node)) node.value.focus()
			return on_click(event)
		}

		use(listen("click", handle_click))

		return () => [
			text_container(() => kindergarten()),
			hotkey_args && actionable_hotkey(typeof hotkey_args === "string" ? { hotkey: hotkey_args, small } : hotkey_args),
		]
	},
)

const add_button_type_class = (type: string, custom_class?: string): string => {
	if (!custom_class) return type

	return `${type} ${custom_class}`
}

declare global {
	namespace OrdoClientMaoka.Components.Button {
		export type Args = {
			aria_label?: string
			custom_class?: string
			disabled?: boolean
			hotkey?: HotkeyArgs | string
			kindergarten: Maoka.Kindergarten
			on_click: (event: MouseEvent) => void | Promise<void>
			small?: boolean
		}

		type Component = (args: Args) => Maoka.Component
	}
}
