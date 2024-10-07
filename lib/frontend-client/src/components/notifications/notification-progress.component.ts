import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { NotificationType } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"

type P = Pick<Ordo.Notification.Instance, "id" | "type" | "duration">
export const NotificationProgress = ({ id, type, duration }: P) => {
	if (!duration) return

	return Maoka.create("div", ({ use, refresh, on_unmount }) => {
		use(MaokaJabs.set_class("absolute inset-x-1.5 bottom-0 rounded-full shadow-inner"))

		let counter = 100

		const { emit } = use(MaokaOrdo.Jabs.Commands)
		const interval = setInterval(() => {
			counter = counter > 0 ? counter - 1 : 0
			void refresh()
		}, duration * 10)

		on_unmount(() => clearInterval(interval))

		return () => {
			if (counter === 0) return emit("cmd.application.notification.hide", id)

			return ProgressBarForeground({ progress: counter, type })
		}
	})
}

// --- Internal ---

type P1 = Pick<Ordo.Notification.Instance, "type"> & { progress: number }
const ProgressBarForeground = ({ progress, type }: P1) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("h-1 rounded-full", get_progress_foreground_class(type)))
		use(MaokaJabs.set_style({ width: progress.toFixed(0).concat("%") }))
	})

const get_progress_foreground_class = (type: Ordo.Notification.Instance["type"]) =>
	Switch.Match(type)
		.case(NotificationType.INFO, () => "bg-sky-300 dark:bg-sky-900")
		.case(NotificationType.QUESTION, () => "bg-violet-300 dark:bg-violet-900")
		.case(NotificationType.RRR, () => "bg-rose-300 dark:bg-rose-900")
		.case(NotificationType.SUCCESS, () => "bg-emerald-300 dark:bg-emerald-900")
		.case(NotificationType.WARN, () => "bg-amber-300 dark:bg-amber-900")
		.default(() => "bg-neutral-300 dark:bg-neutral-900")
