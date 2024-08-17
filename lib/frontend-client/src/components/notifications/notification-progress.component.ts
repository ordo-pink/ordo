import { Switch } from "@ordo-pink/switch"
import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"
import { is_undefined } from "@ordo-pink/tau"

const div = create<TOrdoHooks>("div")

type P = Pick<Client.Notification.Item, "id" | "type" | "duration">
export const NotificationProgress = ({ id, type, duration }: P) => {
	if (!duration || duration <= 0) return

	return div(use => {
		use.set_class("absolute inset-x-1.5 bottom-0 rounded-full shadow-inner")

		const commands = use.get_commands()

		if (is_undefined(counters[id])) {
			counters = { ...counters, [id]: 100 }
			return use.refresh()
		}

		const timeout =
			counters[id] != null &&
			counters[id] > 0 &&
			setTimeout(() => {
				counters = { ...counters, [id]: counters[id] > 0 ? counters[id] - 1 : 0 }
				use.refresh()
			}, duration * 10)

		use.on_refresh(() => {
			timeout && clearTimeout(timeout)

			if (counters[id] === 0) {
				commands.emit("cmd.application.notification.hide", id)
				counters = { ...counters, [id]: -1 }
			}
		})

		return ProgressBarForeground({ id, type })
	})
}

// --- Internal ---

let counters = {} as Record<string, number>

type P1 = Pick<Client.Notification.Item, "id" | "type">
const ProgressBarForeground = ({ id, type }: P1) =>
	div(({ set_class, set_style }) => {
		set_class("h-1 rounded-full", get_progress_foreground_class(type))
		set_style({ width: counters[id].toFixed(0).concat("%") })
	})

const get_progress_foreground_class = (type: Client.Notification.Item["type"]) =>
	Switch.Match(type)
		.case("info", () => "bg-sky-300 dark:bg-sky-900")
		.case("question", () => "bg-violet-300 dark:bg-violet-900")
		.case("rrr", () => "bg-rose-300 dark:bg-rose-900")
		.case("success", () => "bg-emerald-300 dark:bg-emerald-900")
		.case("warn", () => "bg-amber-300 dark:bg-amber-900")
		.default(() => "bg-neutral-300 dark:bg-neutral-900")
