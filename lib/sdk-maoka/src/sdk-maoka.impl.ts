/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka, maoka_context } from "@ordo-pink/maoka"
import type { ClientSDK } from "@ordo-pink/sdk-client"

import { button_neutral, button_primary, button_success } from "./components/button.component"
import { listen_global_event_jab, listen_jab } from "./jabs/listen.jab"
import { set_attribute_jab, set_id_jab } from "./jabs/set-attribute.jab"
import type { MaokaSDK } from "./sdk-maoka.types"
import { actionable_hotkey } from "./components/hotkey.component"
import { class_jabs } from "./jabs/class.jab"
import { is_darwin_jab } from "./jabs/is-darwin.jab"
import { is_mobile_jab } from "./jabs/is-mobile.jab"
import { is_sm_screen_jab$ } from "./jabs/is-sm-screen.jab"
import { set_style_jab } from "./jabs/set-style.jab"
import { translate_jab$ } from "./jabs/translate.jab"
import { zags_jabs } from "./jabs/zags.jab"

export const context: MaokaSDK.Context = maoka_context.create()

export namespace components {
	export const button = { neutral: button_neutral, primary: button_primary, success: button_success }
	export const hotkey = actionable_hotkey
	export const with_state = (state: ClientSDK.F.State, component: () => Maoka.Component) =>
		maoka.create("div", ({ use }) => {
			use(context.provide(state))
			return component
		})()
}

export namespace jabs {
	export const classes = class_jabs
	export const is_darwin = is_darwin_jab
	export const is_mobile = is_mobile_jab
	export const is_sm_screen$ = is_sm_screen_jab$
	export const listen = listen_jab
	export const listen_global_event = listen_global_event_jab
	export const set_attribute = set_attribute_jab
	export const set_id = set_id_jab
	export const set_style = set_style_jab
	export const translate$ = translate_jab$
	export const zags = zags_jabs
}
