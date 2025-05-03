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

import { app } from "@ordo-pink/frontend-app"
import { console_logger } from "@ordo-pink/logger"
import { maoka_dom } from "@ordo-pink/maoka"

const body = document.querySelector("body")!

const hosts: Ordo.Hosts = {
	id: import.meta.env.VITE_ORDO_ID_HOST,
	dt: import.meta.env.VITE_ORDO_DT_HOST,
	pb: import.meta.env.VITE_ORDO_PB_HOST,
	au: import.meta.env.VITE_ORDO_AU_HOST,
	fn: import.meta.env.VITE_ORDO_FN_HOST,
	web: import.meta.env.VITE_ORDO_WEB_HOST,
}

void maoka_dom.render(
	body,
	app({
		hosts,
		logger: console_logger,
		local_persistence_strategy: null as any,
	}),
	() => crypto.randomUUID(),
)
