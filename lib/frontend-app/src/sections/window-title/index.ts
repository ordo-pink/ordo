import { type Maoka } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { title } from "./components/title.component"

export const window_title_jab: Maoka.Jab<() => Maoka.Component> = ({ use }) => {
	const { hunter } = use(maoka_sdk.context.consume)

	hunter.shoot("title.set_title", "loading_title")

	return () => title()
}
