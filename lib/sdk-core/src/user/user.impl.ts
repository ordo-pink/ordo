import { authenticated } from "./mixins/authenticated.mixin"
import { creatable } from "./mixins/creatable.mixin"
import { identifiable } from "../mixins/identifiable.mixin"
import { mix } from "../sdk-core.impl"
import { named } from "../mixins/named.mixin"
import { receptive } from "./mixins/receptive.mixin"
import { referable } from "./mixins/referable.mixin"
import { space_limited } from "./mixins/space-limited.mixin"
import { subscribed } from "./mixins/subscribed.mixin"
import { timestampable } from "../mixins/timestampable.mixin"
import { ui_extendable } from "./mixins/ui-extendable.mixin"
import { user_transferable } from "./mixins/transferable.mixin"

export const public_user = mix(
	identifiable,
	named.mixin,
	referable.mixin,
	subscribed.mixin,
	timestampable.without_updates,
	user_transferable.public_mixin,
)

export const current_user = mix(
	identifiable,
	named.mixin,
	referable.mixin,
	subscribed.mixin,
	timestampable.without_updates,
	authenticated.mixin,
	creatable.mixin,
	receptive.mixin,
	space_limited.mixin,
	ui_extendable.mixin,
	user_transferable.current_mixin,
)
