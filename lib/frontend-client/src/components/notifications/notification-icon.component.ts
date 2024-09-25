import * as Icons from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { Switch } from "@ordo-pink/switch"

type P = Pick<Client.Notification.Item, "icon" | "type">
export const NotificationIcon = ({ icon, type }: P) =>
	Maoka.create("div", ({ use }) => {
		const Icon = icon ? icon : get_default_icon(type)

		use(Maoka.hooks.set_inner_html(Icon))
	})

const get_default_icon = (type: Client.Notification.Item["type"]) =>
	Switch.Match(type)
		.case("info", () => Icons.BS_INFO_CIRCLE)
		.case("question", () => Icons.BS_QUESTION_CIRCLE)
		.case("rrr", () => Icons.BS_ERROR_CIRCLE)
		.case("success", () => Icons.BS_CHECK_CIRCLE)
		.case("warn", () => Icons.BS_EXCLAMATION_CIRCLE)
		.default(() => Icons.BS_CIRCLE)
