import { Switch } from "@ordo-pink/switch"

export const get_card_class = (type: Client.Notification.Item["type"]) =>
	Switch.Match(type)
		.case("info", () => "bg-sky-100 dark:bg-sky-800")
		.case("question", () => "bg-violet-100 dark:bg-violet-800")
		.case("rrr", () => "bg-rose-100 dark:bg-rose-800")
		.case("success", () => "bg-emerald-100 dark:bg-emerald-800")
		.case("warn", () => "bg-amber-100 dark:bg-amber-800")
		.default(() => "bg-neutral-200 dark:bg-neutral-600")
