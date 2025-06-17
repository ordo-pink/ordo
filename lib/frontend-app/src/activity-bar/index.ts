import type { Maoka } from "@ordo-pink/maoka"

import { activity_bar } from "./components/activity-bar.component"

import "./activity-bar.styles.css"

export const create_activity_bar_jab: (sidebar_toggle: Maoka.Component) => Maoka.Jab<() => Maoka.Component> =
	sidebar_toggle => () => {
		return () => activity_bar({ sidebar_toggle })
	}
