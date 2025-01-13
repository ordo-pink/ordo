/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ActionListItem } from "@ordo-pink/maoka-components"
import { ContextMenuItemType } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { ordo_app_state } from "../../app.state"

export const OrdoContextMenu = Maoka.create("div", ({ on_mount, on_unmount, use }) => {
	const commands = use(MaokaOrdo.Jabs.get_commands)

	on_mount(() => {
		commands.on("cmd.application.context_menu.show", handle_show)
		commands.on("cmd.application.context_menu.hide", handle_hide)
		commands.on("cmd.application.context_menu.add", handle_add)
		commands.on("cmd.application.context_menu.remove", handle_remove)
	})

	on_unmount(() => {
		commands.off("cmd.application.context_menu.show", handle_show)
		commands.off("cmd.application.context_menu.hide", handle_hide)
		commands.off("cmd.application.context_menu.add", handle_add)
		commands.off("cmd.application.context_menu.remove", handle_remove)
	})

	return () => OrdoContextMenuDynamic
})

// --- Internal ---

const handle_show: Ordo.Command.HandlerOf<"cmd.application.context_menu.show"> = menu => {
	const structure = ordo_app_state.zags.select("sections.context_menu.items").filter(item => {
		const should_show = item?.should_show({ event: menu.event, payload: menu.payload }) ?? false

		// Avoid showing native context menu if there is something to show
		if (should_show && menu.event.stopPropagation) menu.event.stopPropagation()

		return should_show
	})

	ordo_app_state.zags.update("sections.context_menu.state", () => ({ ...menu, structure }))
}

const handle_hide: Ordo.Command.HandlerOf<"cmd.application.context_menu.hide"> = () =>
	ordo_app_state.zags.update("sections.context_menu.state", () => void 0)

const handle_add: Ordo.Command.HandlerOf<"cmd.application.context_menu.add"> = new_item =>
	ordo_app_state.zags.update("sections.context_menu.items", items =>
		items.some(item => item.command === new_item.command) ? items : items.concat(new_item),
	)

const handle_remove: Ordo.Command.HandlerOf<"cmd.application.context_menu.remove"> = command =>
	ordo_app_state.zags.update("sections.context_menu.items", items => items.filter(item => item.command === command))

const OrdoContextMenuDynamic = Maoka.create("div", ({ use, on_unmount }) => {
	use(MaokaJabs.set_class("context-menu"))
	const is_mobile = use(MaokaJabs.is_mobile)

	const commands = ordo_app_state.zags.select("commands")
	const get_state = use(ordo_app_state.select_jab$("sections.context_menu.state"))

	const handle_click_outside = () => commands.emit("cmd.application.context_menu.hide")

	document.addEventListener("click", handle_click_outside)
	on_unmount(() => document.removeEventListener("click", handle_click_outside))

	return () => {
		const state = get_state()

		if (!state) return

		const all_items = state.structure.filter(
			item =>
				((item.type === ContextMenuItemType.CREATE && !state.hide_create_items) ||
					(item.type === ContextMenuItemType.UPDATE && !state.hide_update_items) ||
					(item.type === ContextMenuItemType.READ && !state.hide_read_items) ||
					(item.type === ContextMenuItemType.DELETE && !state.hide_delete_items)) &&
				item.should_show({ event: state.event, payload: state.payload }),
		)

		if (all_items.length) {
			state.event.stopPropagation()
			state.event.preventDefault()
		}

		const create_items = all_items.filter(item => item.type === ContextMenuItemType.CREATE)
		const read_items = all_items.filter(item => item.type === ContextMenuItemType.READ)
		const update_items = all_items.filter(item => item.type === ContextMenuItemType.UPDATE)
		const delete_items = all_items.filter(item => item.type === ContextMenuItemType.DELETE)

		if (is_mobile) {
			commands.emit("cmd.application.command_palette.show", {
				items: [...create_items, ...read_items, ...update_items, ...delete_items].map(item => ({
					on_select: () =>
						commands.emit(
							item.command,
							item.payload_creator ? item.payload_creator(state.payload as any) : (state.payload as any),
						),
					readable_name: item.readable_name,
					render_icon: item.render_icon,
					hotkey: item.hotkey,
				})),
			})

			return
		}

		const fits_width = state.event.clientX <= window.innerWidth - 320
		const fits_height = state.event.clientY <= window.innerHeight - 400

		const left = fits_width ? `${state.event.clientX}px` : ""
		const top = fits_height ? `${state.event.clientY}px` : ""
		const right = fits_width ? "" : `${window.innerWidth - state.event.clientX}px`
		const bottom = fits_height ? "" : `${window.innerHeight - state.event.clientY}px`

		use(MaokaJabs.set_style({ left, top, right, bottom }))

		return [
			...create_items.map(item => ContextMenuItem(item, state.payload, state.event)),
			read_items.length && update_items.length && delete_items.length ? HR : void 0,
			...read_items.map(item => ContextMenuItem(item, state.payload, state.event)),
			update_items.length && delete_items.length ? HR : void 0,
			...update_items.map(item => ContextMenuItem(item, state.payload, state.event)),
			delete_items.length ? HR : void 0,
			...delete_items.map(item => ContextMenuItem(item, state.payload, state.event)),
		]
	}
})

const HR = Maoka.styled("hr", { class: "context-menu_divider" })(() => void 0)

const ContextMenuItem = (item: Ordo.ContextMenu.Item, payload: any, event: MouseEvent) =>
	Maoka.create("div", () => {
		const commands = ordo_app_state.zags.select("commands")
		const t = ordo_app_state.zags.select("translate")

		return () =>
			ActionListItem({
				title: t(item.readable_name),
				is_current: "hover",
				on_click: () => {
					const current_payload = item.payload_creator ? item.payload_creator({ event, payload }) : payload

					commands.emit(item.command, current_payload)
				},
				render_icon: item.render_icon,
			})
	})
