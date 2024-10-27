import { Observable, Subject } from "rxjs"

import { ActionListItem, Hotkey, Input } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { fuzzy_check } from "@ordo-pink/tau"

import "./command-palette.css"

// TODO Handle is_multiple
// TODO Handle on_new_item
// TODO Handle pinned_items
// TODO Handle arrows
export const CommandPalette = (
	cp$: Observable<Ordo.CommandPalette.Instance>,
	ctx: Ordo.CreateFunction.Params,
) =>
	Maoka.create("div", ({ use, on_unmount }) => {
		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("command-palette"))

		const { t } = use(MaokaOrdo.Jabs.Translations)

		const input$ = new Subject<string>() // TODO Replace with view

		const t_placeholder = t("t.common.components.command_palette.search_placeholder")

		const handle_arrows = (event: KeyboardEvent) => {
			if (event.key === "ArrowUp") console.log("Arrow Up")
			if (event.key === "ArrowDown") console.log("Arrow Down")
		}

		const handle_input_change = (event: Event) =>
			input$.next((event.target as HTMLInputElement).value)

		document.addEventListener("keydown", handle_arrows)

		on_unmount(() => document.removeEventListener("keydown", handle_arrows))

		return () => {
			return [
				Input.Text({
					on_input: handle_input_change,
					custom_class: "command-palette_search",
					placeholder: t_placeholder,
				}),

				CommandPaletteItemsWrapper(input$, cp$),
			]
		}
	})

const CommandPaletteItemsWrapper = (
	input$: Observable<string>,
	cp$: Observable<Ordo.CommandPalette.Instance>,
) =>
	Maoka.create("div", ({ use }) => {
		const { t } = use(MaokaOrdo.Jabs.Translations)
		const get_state = use(MaokaOrdo.Jabs.from$(cp$, undefined, state => state))
		const get_input_value = use(MaokaOrdo.Jabs.from$(input$, ""))

		return () => {
			const input = get_input_value()
			const { max_items: max, items: new_items } = get_state() ?? {}

			if (!new_items || new_items.length <= 0) return

			const all = new_items && max && max > 0 ? new_items.slice(0, max) : new_items
			const items = input ? all.filter(i => fuzzy_check(t(i.readable_name), input, 1)) : all

			return items.map(item => CommandPaletteItem(item))
		}
	})

const CommandPaletteItem = ({
	readable_name,
	on_select,
	accelerator,
	description,
	render_icon,
}: Ordo.CommandPalette.Item) =>
	Maoka.create("div", ({ use }) => {
		const { t } = use(MaokaOrdo.Jabs.Translations)
		const { emit } = use(MaokaOrdo.Jabs.Commands)

		const title = t(readable_name)
		const is_current = false // TODO
		const render_info = accelerator ? () => Hotkey(accelerator) : void 0
		const render_footer = description ? () => Description(() => t(description)) : void 0
		const on_click = () => {
			emit("cmd.application.command_palette.hide")
			on_select()
		}

		return () =>
			ActionListItem({ title, is_current, render_info, render_icon, on_click, render_footer })
	})

const Description = Maoka.styled("div", { class: "text-xs text-neutral-500" })
