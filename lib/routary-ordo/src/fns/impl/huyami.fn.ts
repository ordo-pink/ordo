/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { RoutaryOrdo } from "../../routary-ordo.types"

const ignore_debug_value = Symbol.for("ignore_debug_value")
const default_debug_value_callback = () => ignore_debug_value

export const huyami =
	(intake: RoutaryOrdo.Fuel) =>
	<$X>(message: string, cb: (params: $X) => any = default_debug_value_callback) =>
	(x: $X): void => {
		const more_data = cb(x)

		more_data === ignore_debug_value
			? intake.logger.debug(intake.request_id, message)
			: intake.logger.debug(intake.request_id, `${message}:`, more_data)
	}
