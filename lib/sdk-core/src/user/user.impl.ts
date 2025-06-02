import type { Core } from "../core/core.types"
import type { User } from "./user.types"
import { core } from "../core/core.impl"
import { core_mixins } from "../mixins/mixins.impl"
import { user_mixins } from "./user.mixins"

export namespace user {
	export const someone: Core.Impl<User.Someone.Interface> = core.mix(
		core_mixins.identifiable,
		core_mixins.named,
		user_mixins.referable,
		user_mixins.subscribed,
		core_mixins.timestampable.without_updates,
		user_mixins.serializable.someone,
	)

	export const me = core.mix(
		core_mixins.identifiable,
		core_mixins.named,
		user_mixins.referable,
		user_mixins.subscribed,
		core_mixins.timestampable.without_updates,
		user_mixins.authenticated,
		user_mixins.receptive,
		user_mixins.space_limited,
		user_mixins.ui_extendable,
		user_mixins.creatable.me,
		user_mixins.serializable.me,
	)
}
