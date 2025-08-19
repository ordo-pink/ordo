/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka, MaokaContext } from "@ordo-pink/oss-maoka"
import type { ClientSDK } from "@ordo-pink/sdk-client"

export type Context = MaokaContext.Instance<ClientSDK.F.State>

export namespace Jabs {
	export type TranslateFn = (default_value?: string) => string
	export type Translate$ = (key?: ClientSDK.Translations.Key) => Maoka.Jab<Jabs.TranslateFn>

	export type TFn = (key: ClientSDK.Translations.Key, default_value?: string) => string
	export type T$ = Maoka.Jab<Jabs.TFn>
}

export namespace Components {
	export type ButtonArgs = {
		aria_label?: string
		custom_class?: string
		disabled?: boolean
		hotkey?: HotkeyArgs | string
		kindergarten: Maoka.Kindergarten
		on_click: (event: MouseEvent) => void | Promise<void>
	}

	export type HotkeyArgs = {
		decoration_only?: boolean
		hotkey: string
		prevent_in_contenteditable?: boolean
		prevent_in_inputs?: boolean
		show_in_mobile?: boolean
	}
}

export namespace Pouch {
	export type NoSpaceString<$Str extends string> = $Str extends `${string} ${string}` ? never : $Str
}
