/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { CoreSDK } from "../core/core.types"
import type { Data } from "./data.types"
import { core_sdk } from "../core/core.impl"
import { core_mixins } from "../mixins/mixins.impl"
import { data_mixins } from "./data.mixins"

export const data: CoreSDK.Impl<Data.Interface> = core_sdk.mix(
	core_mixins.identifiable,
	core_mixins.timestampable.with_updates,
	core_mixins.authored.with_updates,
	core_mixins.named,
	core_mixins.extendable,
	data_mixins.childish,
	data_mixins.contentful,
	data_mixins.creatable,
	data_mixins.linkable,
	data_mixins.taggable,
	data_mixins.persistable,
	data_mixins.accessible,
	data_mixins.serializable,
)
