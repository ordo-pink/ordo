import type { Maoka } from "@ordo-pink/maoka"

import { activity_bar } from "./components/activity-bar.component"

import "./activity-bar.styles.css"

export const create_activity_bar_jab: Maoka.Jab<() => Maoka.Component> = () => {
	return () => activity_bar()
}
