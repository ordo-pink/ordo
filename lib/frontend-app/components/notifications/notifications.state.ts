import { MaokaZAGS } from "@ordo-pink/maoka-zags"

export const ordo_notifications_state = MaokaZAGS.Of({
	notifications: [] as Ordo.Notification.Instance[],
	progress_bars: {} as Record<string, number>,
})
