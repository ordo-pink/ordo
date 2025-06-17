import type { ClientSDK } from "@ordo-pink/sdk-client"
import type { RRR } from "@ordo-pink/sdk-core"

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

declare global {
	interface t {
		http: {
			rrr: {
				codes: Record<keyof typeof RRR.TYPE, string>
			}
		}
	}
}
