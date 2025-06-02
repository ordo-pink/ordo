/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka, maoka_context } from "@ordo-pink/maoka"
import type { Client } from "@ordo-pink/sdk-client"

import { button_neutral, button_primary, button_success } from "./components/button.component"
import type { MaokaSDK } from "./sdk-maoka.types"
import { actionable_hotkey } from "./components/hotkey.component"
import { translate_jab$ } from "./jabs/translate.jab"

export const context: MaokaSDK.Context = maoka_context.create()

export namespace components {
	export const button = { neutral: button_neutral, primary: button_primary, success: button_success }
	export const hotkey = actionable_hotkey
	export const with_state = (state: Client.F.State, component: () => Maoka.Component) =>
		maoka.create("div", ({ use }) => {
			use(context.provide(state))
			return component
		})()
}

export namespace jabs {
	export const translate$ = translate_jab$
}
