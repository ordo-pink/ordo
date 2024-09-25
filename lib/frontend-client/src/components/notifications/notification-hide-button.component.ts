import { BS_X } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { Switch } from "@ordo-pink/switch"
import { get_commands } from "@ordo-pink/maoka-ordo-hooks"

type P = Pick<Client.Notification.Item, "id" | "type">
export const NotificationHideButton = ({ id, type }: P) =>
	Maoka.create("button", ({ use }) => {
		const { emit } = use(get_commands)
		const hover_class = get_hover_close_button_class(type)

		use(Maoka.hooks.set_class("absolute right-2 top-2 rounded-full p-1", hover_class))
		use(Maoka.hooks.listen("onclick", handle_hide_notification_click(emit, id)))
		use(Maoka.hooks.set_inner_html(BS_X))
	})

// --- Internal ---

const handle_hide_notification_click =
	(emit: Client.Commands.Commands["emit"], id: Client.Notification.Item["id"]) =>
	(event: MouseEvent) => {
		event.preventDefault()
		event.stopPropagation()

		emit("cmd.application.notification.hide", id)
	}

const get_hover_close_button_class = (type: Client.Notification.Item["type"]) =>
	Switch.Match(type)
		.case("info", () => "hover:bg-sky-300 hover:dark:bg-sky-900")
		.case("question", () => "hover:bg-violet-300 hover:dark:bg-violet-900")
		.case("rrr", () => "hover:bg-rose-300 hover:dark:bg-rose-900")
		.case("success", () => "hover:bg-emerald-300 hover:dark:bg-emerald-900")
		.case("warn", () => "hover:bg-amber-300 hover:dark:bg-amber-900")
		.default(() => "hover:bg-neutral-300 hover:dark:bg-neutral-900")
