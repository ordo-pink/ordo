import { Maoka } from "@ordo-pink/maoka"
import { Switch } from "@ordo-pink/switch"
import { get_commands } from "@ordo-pink/maoka-ordo-hooks"

type P = Pick<Client.Notification.Item, "id" | "type" | "duration">
export const NotificationProgress = ({ id, type, duration }: P) => {
	if (!duration) return

	return Maoka.create("div", ({ use, refresh, on_unmount }) => {
		let counter = 100

		const { emit } = use(get_commands)
		const interval = setInterval(() => {
			counter = counter > 0 ? counter - 1 : 0
			refresh()
		}, duration * 10)

		use(Maoka.hooks.set_class("absolute inset-x-1.5 bottom-0 rounded-full shadow-inner"))

		on_unmount(() => clearInterval(interval))

		return () => {
			if (counter === 0) return emit("cmd.application.notification.hide", id)

			return ProgressBarForeground({ progress: counter, type })
		}
	})
}

// --- Internal ---

type P1 = Pick<Client.Notification.Item, "type"> & { progress: number }
const ProgressBarForeground = ({ progress, type }: P1) =>
	Maoka.create("div", ({ use }) => {
		use(Maoka.hooks.set_class("h-1 rounded-full", get_progress_foreground_class(type)))
		use(Maoka.hooks.set_style({ width: progress.toFixed(0).concat("%") }))
	})

const get_progress_foreground_class = (type: Client.Notification.Item["type"]) =>
	Switch.Match(type)
		.case("info", () => "bg-sky-300 dark:bg-sky-900")
		.case("question", () => "bg-violet-300 dark:bg-violet-900")
		.case("rrr", () => "bg-rose-300 dark:bg-rose-900")
		.case("success", () => "bg-emerald-300 dark:bg-emerald-900")
		.case("warn", () => "bg-amber-300 dark:bg-amber-900")
		.default(() => "bg-neutral-300 dark:bg-neutral-900")
