/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka, maoka_context } from "@ordo-pink/oss-maoka"
import type { ClientSDK } from "@ordo-pink/sdk-client"

import type * as Lib from "./sdk-client-maoka.types"
import { button_danger, button_neutral, button_primary, button_success } from "./components/button.component"
import { create_dialog_actions, create_dialog_info, dialog_actions, dialog_info } from "./components/dialog.component"
import { listen_global_event_jab, listen_jab } from "./jabs/listen.jab"
import { register_translations_jab, t_jab$, translate_jab$ } from "./jabs/translate.jab"
import { set_attribute_jab, set_id_jab } from "./jabs/set-attribute.jab"
import { actionable_hotkey } from "./components/hotkey.component"
import { class_jabs } from "./jabs/class.jab"
import { hunter_jabs } from "./jabs/hunter.jab"
import { is_darwin_jab } from "./jabs/is-darwin.jab"
import { is_mobile_jab } from "./jabs/is-mobile.jab"
import { is_sm_screen_jab$ } from "./jabs/is-sm-screen.jab"
import { set_style_jab } from "./jabs/set-style.jab"
import { zags_jabs } from "./jabs/zags.jab"

export const context: Lib.Context = maoka_context.create()

export namespace components {
	export namespace button {
		export const danger = button_danger
		export const neutral = button_neutral
		export const primary = button_primary
		export const success = button_success
	}

	export namespace dialog {
		export const info = dialog_info
		export const actions = dialog_actions
	}
	export const hotkey = actionable_hotkey
	export const with_state = (state: ClientSDK.F.State, component: () => Maoka.Component) =>
		maoka.create("div", ({ use }) => {
			use(context.provide(state))
			return component
		})()
}

export namespace jabs {
	export const classes = class_jabs
	export const hunter = hunter_jabs
	export const is_darwin = is_darwin_jab
	export const is_mobile = is_mobile_jab
	export const is_sm_screen$ = is_sm_screen_jab$
	export const listen = listen_jab
	export const listen_global_event = listen_global_event_jab
	export const register_translations = register_translations_jab
	export const set_attribute = set_attribute_jab
	export const set_id = set_id_jab
	export const set_style = set_style_jab
	export const t$ = t_jab$
	export const translate$ = translate_jab$
	export const zags = zags_jabs
	export namespace dialog {
		export const info = create_dialog_info
		export const actions = create_dialog_actions
	}
}
