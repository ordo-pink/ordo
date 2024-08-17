import { BS_X } from "@ordo-pink/frontend-icons"
import { Switch } from "@ordo-pink/switch"
import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

const button = create<TOrdoHooks>("button")

type P = Pick<Client.Notification.Item, "id" | "type">
export const NotificationHideButton = ({ id, type }: P) =>
	button(use => {
		const commands = use.get_commands()

		use.set_class("absolute right-2 top-2 rounded-full p-1", get_hover_close_button_class(type))
		use.set_listener("onclick", handle_hide_notification_click(commands, id))

		use.set_inner_html(BS_X)
	})

// --- Internal ---

const handle_hide_notification_click =
	(commands: Client.Commands.Commands, id: Client.Notification.Item["id"]) =>
	(event: MouseEvent) => {
		event.preventDefault()
		event.stopPropagation()

		commands.emit("cmd.application.notification.hide", id)
	}

const get_hover_close_button_class = (type: Client.Notification.Item["type"]) =>
	Switch.Match(type)
		.case("info", () => "hover:bg-sky-300 hover:dark:bg-sky-900")
		.case("question", () => "hover:bg-violet-300 hover:dark:bg-violet-900")
		.case("rrr", () => "hover:bg-rose-300 hover:dark:bg-rose-900")
		.case("success", () => "hover:bg-emerald-300 hover:dark:bg-emerald-900")
		.case("warn", () => "hover:bg-amber-300 hover:dark:bg-amber-900")
		.default(() => "hover:bg-neutral-300 hover:dark:bg-neutral-900")
