import { Maoka, TMaokaComponent } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { ActionListItem } from "./action-list-item.component"

export type TSelectOption<$TValue> = {
	title: string
	value: $TValue
	render_icon?: (div: HTMLDivElement) => void
	render_info?: () => TMaokaComponent
	render_footer?: () => TMaokaComponent
}

export type TSelectProps<$TValue> = {
	current_value: TSelectOption<$TValue>
	on_select: (value: $TValue) => void
	items: TSelectOption<$TValue>[]
}

export const Select = <$TValue>({ current_value, on_select, items }: TSelectProps<$TValue>) =>
	Maoka.create("div", ({ use, refresh }) => {
		use(MaokaJabs.set_attribute("tabindex", "1"))

		let is_active = false
		let value = current_value

		const handle_active_select_click = (selected_item: TSelectOption<$TValue>) => {
			is_active = false
			value = selected_item
			void refresh()
			on_select(selected_item.value)
		}

		const handle_inactive_select_click = () => {
			is_active = true
			void refresh()
		}

		return () =>
			is_active
				? Maoka.create("div", () => {
						return () =>
							items.map(item =>
								ActionListItem({
									is_current: value.title === item.title,
									title: item.title,
									on_click: () => handle_active_select_click(item),
									render_icon: item.render_icon,
									render_footer: item.render_footer,
									render_info: item.render_info,
								}),
							)
					})
				: ActionListItem({
						is_current: false,
						title: value.title,
						on_click: handle_inactive_select_click,
						render_icon: value.render_icon,
						render_footer: value.render_footer,
						render_info: value.render_info,
					})
	})
