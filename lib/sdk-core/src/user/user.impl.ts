/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { CoreSDK } from "../core/core.types"
import type { User } from "./user.types"
import { core_sdk } from "../core/core.impl"
import { core_mixins } from "../mixins/mixins.impl"
import { user_mixins } from "./user.mixins"

export namespace user {
	export const someone: CoreSDK.Impl<User.Someone.Interface> = core_sdk.mix(
		core_mixins.identifiable,
		core_mixins.named,
		user_mixins.referable,
		user_mixins.subscribed,
		core_mixins.timestampable.without_updates,
		user_mixins.serializable.someone,
	)

	export const current = core_sdk.mix(
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
