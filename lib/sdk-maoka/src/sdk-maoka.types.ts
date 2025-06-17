/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { ClientSDK } from "@ordo-pink/sdk-client"
import { Maoka } from "@ordo-pink/maoka"

export namespace MaokaSDK {
	export type Context = Maoka.Context.Instance<ClientSDK.F.State>

	export namespace Jabs {
		export type TranslateFn = (default_value?: string) => string
		export type Translate$ = (key?: ClientSDK.Translations.Key) => Maoka.Jab<MaokaSDK.Jabs.TranslateFn>

		export type TFn = (key: ClientSDK.Translations.Key, default_value?: string) => string
		export type T$ = Maoka.Jab<MaokaSDK.Jabs.TFn>
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

	export namespace Pouch {
		export type NoSpaceString<$Str extends string> = $Str extends `${string} ${string}` ? never : $Str
	}
}
