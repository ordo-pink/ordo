/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Client } from "@ordo-pink/sdk-client"
import { Maoka } from "@ordo-pink/maoka"

export namespace MaokaSDK {
	export type Context = Maoka.Context.Instance<Client.F.State>

	export namespace Jabs {
		export type Translate$ = (key?: Client.Translations.Key) => Maoka.Jab<(default_value?: string) => string>
	}

	export namespace Components {
		export type ButtonArgs = {
			on_click: (event: MouseEvent) => void | Promise<void>
			kindergarten: Maoka.Kindergarten
			hotkey?: HotkeyArgs | string
			custom_class?: string
			aria_label?: string
		}

		export type HotkeyArgs = {
			hotkey: string
			prevent_in_inputs?: boolean
			prevent_in_contenteditable?: boolean
			decoration_only?: boolean
			show_in_mobile?: boolean
		}
	}
}
