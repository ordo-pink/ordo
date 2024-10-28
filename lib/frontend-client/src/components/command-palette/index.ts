import { BehaviorSubject, type Observable } from "rxjs"

import { Hotkey, Input } from "@ordo-pink/maoka-components"
import { fuzzy_check, noop } from "@ordo-pink/tau"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"

import { CommandPaletteItems } from "./command-palette-items.component"
import { CurrentItemLocation } from "./constants"

import "./command-palette.css"

// TODO Handle is_multiple
// TODO Handle on_new_item
// TODO Handle pinned_items
// TODO Handle alternative layout characters
export const CommandPalette = (
	cp$: Observable<Ordo.CommandPalette.Instance>,
	ctx: Ordo.CreateFunction.Params,
) =>
	Maoka.create("div", ({ use, on_unmount, after_mount }) => {
		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("command-palette"))

		const visible_items$ = new BehaviorSubject([] as Ordo.CommandPalette.Item[])
		const pinned_items$ = new BehaviorSubject([] as Ordo.CommandPalette.Item[])
		const current_item_index$ = new BehaviorSubject(0)
		const current_item_location$ = new BehaviorSubject(CurrentItemLocation.SUGGESTED)

		const { emit } = use(MaokaOrdo.Jabs.Commands)
		const { t } = use(MaokaOrdo.Jabs.Translations)

		const t_placeholder = t("t.common.components.command_palette.search_placeholder")

		const get_state = use(
			MaokaOrdo.Jabs.from$(cp$, { items: [] }, value => {
				current_item_index$.next(0)
				visible_items$.next(
					value.max_items && value.max_items > 0
						? value.items.slice(0, value.max_items)
						: value.items,
				)

				if (value.pinned_items) pinned_items$.next(value.pinned_items)

				return value
			}),
		)

		const handle_keydown = (event: KeyboardEvent) =>
			Switch.Match(event.key)
				.case("ArrowUp", handle_arrow_up)
				.case("ArrowDown", handle_arrow_down)
				.case("Tab", handle_tab)
				.case("Enter", handle_enter)
				.default(noop)

		const handle_enter = () => {
			const visible_items = visible_items$.getValue()

			if (!visible_items.length) return

			const invoke = visible_items[current_item_index$.getValue()].on_select

			emit("cmd.application.command_palette.hide")
			invoke()
		}

		const handle_arrow_up = () => {
			const visible_items = visible_items$.getValue()

			if (!visible_items.length) return

			const current_value = current_item_index$.getValue()

			if (current_value === 0) current_item_index$.next(visible_items.length - 1)
			else current_item_index$.next(current_value - 1)
		}

		const handle_arrow_down = () => {
			const visible_items = visible_items$.getValue()

			if (!visible_items.length) return

			const current_value = current_item_index$.getValue()

			if (current_value === visible_items.length - 1) current_item_index$.next(0)
			else current_item_index$.next(current_value + 1)
		}

		const handle_tab = () => {
			const state = get_state()

			if (!state.is_multiple) return

			const current_item_location = current_item_location$.getValue()

			current_item_location$.next(
				current_item_location === CurrentItemLocation.PINNED
					? CurrentItemLocation.SUGGESTED
					: CurrentItemLocation.PINNED,
			)
		}

		const handle_input_change = (event: Event) => {
			const input = (event.target as HTMLInputElement)?.value
			const state = get_state()
			const all = state.items

			const source = input ? all.filter(item => fuzzy_check(t(item.readable_name), input, 1)) : all
			const length = state.max_items && state.max_items > 0 ? state.max_items : source.length - 1

			visible_items$.next(source.slice(0, length))
			current_item_index$.next(0)
		}

		after_mount(() => document.addEventListener("keydown", handle_keydown))
		on_unmount(() => document.removeEventListener("keydown", handle_keydown))

		return () => {
			const state = get_state()

			return [
				Input.Text({
					on_input: handle_input_change,
					custom_class: "command-palette_search",
					placeholder: t_placeholder,
					autofocus: true,
				}),

				state.pinned_items
					? CommandPaletteItems(
							pinned_items$,
							current_item_index$,
							current_item_location$,
							CurrentItemLocation.PINNED,
						)
					: void 0,

				CommandPaletteItems(
					visible_items$,
					current_item_index$,
					current_item_location$,
					CurrentItemLocation.SUGGESTED,
				),

				Switch.OfTrue()
					.case(!!state.pinned_items, () =>
						Hint(() => [
							Hotkey("arrowup", { smol: true, decoration_only: true }),
							Hotkey("arrowdown", { smol: true, decoration_only: true }),
							Hotkey("tab", { smol: true, decoration_only: true }),
							Hotkey("enter", { smol: true, decoration_only: true }),
							Hotkey("escape", { smol: true, decoration_only: true }),
						]),
					)
					.default(() =>
						Hint(() => [
							Hotkey("arrowup", { smol: true, decoration_only: true }),
							Hotkey("arrowdown", { smol: true, decoration_only: true }),
							Hotkey("escape", { smol: true, decoration_only: true }),
							Hotkey("enter", { smol: true, decoration_only: true }),
						]),
					),
			]
		}
	})

const Hint = Maoka.styled("div", { class: "command-palette_hint" })
