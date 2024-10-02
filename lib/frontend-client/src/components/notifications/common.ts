import { NotificationType } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"

export const get_card_class = (type: Ordo.Notification.Instance["type"]) =>
	Switch.Match(type)
		.case(NotificationType.INFO, () => "bg-sky-100 dark:bg-sky-800")
		.case(NotificationType.QUESTION, () => "bg-violet-100 dark:bg-violet-800")
		.case(NotificationType.RRR, () => "bg-rose-100 dark:bg-rose-800")
		.case(NotificationType.SUCCESS, () => "bg-emerald-100 dark:bg-emerald-800")
		.case(NotificationType.WARN, () => "bg-amber-100 dark:bg-amber-800")
		.default(() => "bg-neutral-200 dark:bg-neutral-600")
