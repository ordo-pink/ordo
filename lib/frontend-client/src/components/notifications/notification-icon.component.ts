import * as Icons from "@ordo-pink/frontend-icons"
import { Switch } from "@ordo-pink/switch"
import { create } from "@ordo-pink/maoka"

const div = create("div")

type P = Pick<Client.Notification.Item, "icon" | "type">
export const NotificationIcon = ({ icon, type }: P) =>
	div(use => use.set_inner_html(icon ? icon : get_default_icon(type)))

const get_default_icon = (type: Client.Notification.Item["type"]) =>
	Switch.Match(type)
		.case("info", () => Icons.BS_INFO_CIRCLE)
		.case("question", () => Icons.BS_QUESTION_CIRCLE)
		.case("rrr", () => Icons.BS_ERROR_CIRCLE)
		.case("success", () => Icons.BS_CHECK_CIRCLE)
		.case("warn", () => Icons.BS_EXCLAMATION_CIRCLE)
		.default(() => Icons.BS_CIRCLE)
