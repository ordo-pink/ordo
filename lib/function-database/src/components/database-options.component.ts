import { Button } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { DATABASE_CONTEXT_MENU_PAYLOAD } from "../database.constants"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

export const DatabaseOptions = Maoka.create("div", ({ use }) => {
	use(MaokaJabs.set_class("pb-2 flex justify-end"))

	const commands = use(MaokaOrdo.Jabs.Commands.get)

	return () =>
		Button.Primary({
			hotkey: "mod+,",
			// TODO Set event pageX and pageY to the bounding rect of the element
			on_click: event => commands.emit("cmd.application.context_menu.show", { event, payload: DATABASE_CONTEXT_MENU_PAYLOAD }),
			text: "Options",
		})
})
