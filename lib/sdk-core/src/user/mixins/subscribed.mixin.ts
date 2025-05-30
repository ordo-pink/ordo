import type { Core } from "../../sdk-core.types"
import { is_int } from "../../validations.impl"

export namespace subscribed {
	export enum SUBSCRIPTION {
		FREE,
		PERSONAL,
		FAMILY,
		TEAM,
		ENTERPRISE,
		length,
	}

	export const DEFAULT_SUBSCRIPTION = SUBSCRIPTION.FREE

	export const mixin: Core.Mixin<Subscribed.Interface> = {
		instance: ({ subscription }) => ({
			get_subscription: () => subscription,
			has_paid_subscription: () => Number(subscription) > 0 && Number(subscription) < Number(SUBSCRIPTION.length),
		}),
		static: {
			get_default_subscription: () => DEFAULT_SUBSCRIPTION,
			SUBSCRIPTION,
		},
		validations: {
			is_subscription: (x): x is SUBSCRIPTION => is_int(x) && x >= 0 && x < Number(SUBSCRIPTION.length),
		},
	}
}

export namespace Subscribed {
	export type DTO = [subscription: subscribed.SUBSCRIPTION]

	export type Interface = {
		Instance: {
			get_subscription: () => subscribed.SUBSCRIPTION
			has_paid_subscription: () => boolean
		}
		Plain: { subscription: subscribed.SUBSCRIPTION }
		Static: {
			SUBSCRIPTION: typeof subscribed.SUBSCRIPTION
			get_default_subscription: () => subscribed.SUBSCRIPTION
		}
		Validations: { is_subscription: (x: any) => x is subscribed.SUBSCRIPTION }
	}
}
