/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

import { context } from "../sdk-client-maoka.impl"

/**
 * @state
 * @command {command}
 */
export const handle_command =
	<$Prey extends OrdoClient.Command.Prey>(command: $Prey, handler: OrdoClient.Command.GunFor<$Prey>): Maoka.Jab =>
	({ use }) => {
		const { hunter } = use(context.consume)

		use(maoka_dom.jabs.onmount(() => hunter.track(command, handler)))
	}

/**
 * @state
 * @command @ordo/main.command_palette.add
 * @command @ordo/main.command_palette.remove
 */
export const add_command_palette_item =
	(readable_name: string, on_select: () => void, params?: OrdoClientMaoka.Jabs.AddCommandPaletteItem.Params): Maoka.Jab =>
	({ use }) => {
		const id = params?.id ?? crypto.randomUUID()
		const type = params?.type
		const description = params?.description
		const hotkey = params?.hotkey
		const render_icon = params?.render_icon

		const { hunter } = use(context.consume)

		const handle_onmount = () => {
			hunter.shoot("@ordo/main.command_palette.add", {
				description,
				hotkey,
				id,
				readable_name,
				render_icon,
				type,
				value: on_select,
			})

			return () => {
				hunter.shoot("@ordo/main.command_palette.remove", id)
			}
		}

		use(maoka_dom.jabs.onmount(handle_onmount))
	}

/**
 * @state
 * @command @ordo/main.i18n.add_translations
 * @command @ordo/main.i18n.remove_translations
 */
export const add_translations =
	<$Async extends "async" | undefined>(
		locale: OrdoClient.Translations.Locale,
		values: OrdoClient.Translations.Values,
		async?: $Async,
	): $Async extends void ? Maoka.Jab<void> : Maoka.Jab<Promise<void>> =>
	({ use }) => {
		const { hunter } = use(context.consume)
		const result = hunter.shoot("@ordo/main.i18n.add_translations", { locale, values })

		use(maoka_dom.jabs.onunmount(() => void hunter.shoot("@ordo/main.i18n.remove_translations", Object.keys(values))))

		if (async) return result.to_promise() as any
	}

/**
 * @state
 */
export const hunter: Maoka.Jab<OrdoClient.Command.Hunter> = ({ use }) => {
	const state = use(context.consume)

	return state.hunter
}

declare global {
	namespace OrdoClientMaoka.Jabs.AddCommandPaletteItem {
		type Params = {
			description?: string
			hotkey?: string
			id?: string
			render_icon?: OrdoClient.CommandPalette.RenderIcon
			type?: OrdoClient.CommandPalette.ItemType
		}
	}
}
