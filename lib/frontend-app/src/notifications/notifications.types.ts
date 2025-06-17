import type { ClientSDK } from "@ordo-pink/sdk-client"

declare global {
	interface t {
		notifications: {
			pending_notifications: string
		}
	}
}

export namespace Notifications {
	export type State = {
		items: ClientSDK.Notification.Instance[]
		progress_bars: Record<string, number>
	}
}
