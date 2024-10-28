import { ActionListItem, Hotkey } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const CommandPaletteItem = (
	{
		readable_name,
		on_select,
		hotkey,
		description,
		render_icon,
		render_custom_footer,
		render_custom_info,
	}: Ordo.CommandPalette.Item,
	is_current: boolean,
) =>
	Maoka.create("div", ({ use, element, after_mount }) => {
		const { t } = use(MaokaOrdo.Jabs.Translations)
		const { emit } = use(MaokaOrdo.Jabs.Commands)

		const title = t(readable_name)
		const render_info = render_custom_info
			? render_custom_info
			: hotkey
				? () => Hotkey(hotkey, { prevent_in_inputs: true })
				: void 0

		const render_footer = render_custom_footer
			? render_custom_footer
			: description
				? () => Description(() => t(description))
				: void 0

		const on_click = () => {
			emit("cmd.application.command_palette.hide")
			on_select()
		}

		after_mount(() => {
			if (is_current && !is_in_view(element as Element, element.parentElement!))
				element.scrollIntoView?.({ behavior: "smooth", inline: "center", block: "center" })
		})

		return () =>
			ActionListItem({
				title,
				is_current,
				render_info,
				render_icon,
				on_click,
				render_footer,
			})
	})

const Description = Maoka.styled("div", { class: "text-xs text-neutral-600 dark:text-neutral-400" })

// TODO Move to tau/client
const is_in_view = (element: Element, wrapper: Element) => {
	const rect = element.getBoundingClientRect()

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= wrapper?.clientHeight /* or $(window).height() */ &&
		rect.right <= wrapper?.clientWidth /* or $(window).width() */
	)
}
