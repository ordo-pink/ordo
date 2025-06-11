import type { ClientSDK } from "@ordo-pink/sdk-client"

export namespace ActivityBar {
	export type State = {
		current: ClientSDK.Activity.Instance | null
		items: ClientSDK.Activity.Instance[]
	}
}
