// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import * as Icons from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { NotificationType } from "@ordo-pink/core"
import { Switch } from "@ordo-pink/switch"

type P = Pick<Ordo.Notification.Instance, "render_icon" | "type">
export const NotificationIcon = ({ render_icon, type }: P) =>
	Maoka.create("div", ({ use, element: current_element }) => {
		if (render_icon) render_icon(current_element as unknown as HTMLDivElement)
		else use(MaokaJabs.set_inner_html(get_default_icon(type)))
	})

const get_default_icon = (type: Ordo.Notification.Instance["type"]) =>
	Switch.Match(type)
		.case(NotificationType.INFO, () => Icons.BS_INFO_CIRCLE)
		.case(NotificationType.QUESTION, () => Icons.BS_QUESTION_CIRCLE)
		.case(NotificationType.RRR, () => Icons.BS_ERROR_CIRCLE)
		.case(NotificationType.SUCCESS, () => Icons.BS_CHECK_CIRCLE)
		.case(NotificationType.WARN, () => Icons.BS_EXCLAMATION_CIRCLE)
		.default(() => Icons.BS_CIRCLE)
