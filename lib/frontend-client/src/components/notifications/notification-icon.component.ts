import * as Icons from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { NotificationType } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"

type P = Pick<Ordo.Notification.Instance, "render_icon" | "type">
export const NotificationIcon = ({ render_icon, type }: P) =>
	Maoka.create("div", ({ use, current_element }) => {
		if (render_icon) render_icon(current_element as unknown as HTMLDivElement)
		else use(Maoka.hooks.set_inner_html(get_default_icon(type)))
	})

const get_default_icon = (type: Ordo.Notification.Instance["type"]) =>
	Switch.Match(type)
		.case(NotificationType.INFO, () => Icons.BS_INFO_CIRCLE)
		.case(NotificationType.QUESTION, () => Icons.BS_QUESTION_CIRCLE)
		.case(NotificationType.RRR, () => Icons.BS_ERROR_CIRCLE)
		.case(NotificationType.SUCCESS, () => Icons.BS_CHECK_CIRCLE)
		.case(NotificationType.WARN, () => Icons.BS_EXCLAMATION_CIRCLE)
		.default(() => Icons.BS_CIRCLE)
