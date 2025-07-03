import type { Maoka } from "@ordo-pink/maoka"

import { activity_bar } from "./components/activity-bar.component"

import "./activity-bar.styles.css"

export const create_activity_bar_jab: (
	command_palette_toggle: () => Maoka.Component,
	sidebar_toggle: () => Maoka.Component,
) => Maoka.Jab<() => Maoka.Component> = (command_palette_toggle, sidebar_toggle) => () => {
	return () => activity_bar({ command_palette_toggle, sidebar_toggle })
}
