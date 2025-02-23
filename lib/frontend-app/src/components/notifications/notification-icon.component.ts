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

import {
	BsCheckCircle,
	BsCircle,
	BsErrorCircle,
	BsExclamationCircle,
	BsInfoCircle,
	BsQuestionCircle,
} from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { NotificationType } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"

type P = Pick<Ordo.Notification.Instance, "render_icon" | "type">
export const OrdoNotificationIcon = ({ render_icon, type }: P) =>
	Maoka.create("div", ({ element }) => {
		if (render_icon) render_icon(element as unknown as HTMLDivElement)
		else
			return () =>
				Switch.Match(type)
					.case(NotificationType.INFO, () => BsInfoCircle("text-sky-500"))
					.case(NotificationType.QUESTION, () => BsQuestionCircle("text-violet-500"))
					.case(NotificationType.RRR, () => BsErrorCircle("text-rose-500"))
					.case(NotificationType.SUCCESS, () => BsCheckCircle("text-emerald-500"))
					.case(NotificationType.WARN, () => BsExclamationCircle("text-amber-500"))
					.default(() => BsCircle("text-neutral-500"))
	})
