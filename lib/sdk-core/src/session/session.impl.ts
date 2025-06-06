/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { core } from "../core/core.impl"
import { core_mixins } from "../mixins/mixins.impl"
import { session_mixins } from "./session.mixins"

export const session = core.mix(
	core_mixins.identifiable,
	core_mixins.timestampable.without_updates,
	session_mixins.device_aware,
	session_mixins.serializable,
)
