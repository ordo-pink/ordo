import { NotificationType } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"

export const get_readable_type = (type: Ordo.Notification.Instance["type"]) =>
	Switch.Match(type)
		.case(NotificationType.INFO, () => "info")
		.case(NotificationType.QUESTION, () => "question")
		.case(NotificationType.RRR, () => "rrr")
		.case(NotificationType.SUCCESS, () => "success")
		.case(NotificationType.WARN, () => "warn")
		.default(() => "default")
