import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { get_readable_type } from "./common"

type P = Pick<Ordo.Notification.Instance, "id" | "type" | "duration">
export const NotificationProgress = ({ id, type, duration }: P) => {
	if (!duration) return

	return Maoka.create("div", ({ use, refresh, on_unmount }) => {
		use(MaokaJabs.set_class("notification-card_progress"))

		let progress = 100

		const commands = use(MaokaOrdo.Jabs.Commands)
		const interval = setInterval(() => {
			progress = progress > 0 ? progress - 1 : 0
			void refresh()
		}, duration * 10)

		on_unmount(() => clearInterval(interval))

		return () => {
			if (progress === 0) {
				commands.emit("cmd.application.notification.hide", id)
				return
			}

			return ProgressBarForeground({ progress, type })
		}
	})
}

// --- Internal ---

type P1 = Pick<Ordo.Notification.Instance, "type"> & { progress: number }
const ProgressBarForeground = ({ progress, type }: P1) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("notification-card_progress_foreground", get_readable_type(type)))
		use(MaokaJabs.set_style({ width: progress.toFixed(0).concat("%") }))
	})
