/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Observable } from "rxjs"

import { BS_CLOUD_DOWNLOAD, BS_CLOUD_UPLOAD } from "@ordo-pink/frontend-icons"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

export const BackgroundTaskIndicator = ($: Observable<BackgroundTaskStatus>) =>
	Maoka.create("div", ({ use }) => {
		const get_status = use(MaokaOrdo.Jabs.from$($, BackgroundTaskStatus.NONE))

		return () => {
			const status = get_status()

			return Switch.Match(status)
				.case(BackgroundTaskStatus.LOADING, () => LoadingIcon)
				.case(BackgroundTaskStatus.SAVING, () => SavingIcon)
				.default(() => NoIcon)
		}
	})

// --- Internal ---

const LoadingIcon = Maoka.html("span", BS_CLOUD_DOWNLOAD)
const SavingIcon = Maoka.html("span", BS_CLOUD_UPLOAD)
const NoIcon = Maoka.create("span", noop)
