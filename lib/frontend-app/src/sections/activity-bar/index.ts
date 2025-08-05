/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import type { Maoka } from "@ordo-pink/oss-maoka"

import { activity_bar } from "./components/activity-bar.component"

import "./activity-bar.styles.css"

export const create_activity_bar_jab: (
	command_palette_toggle: () => Maoka.Component,
	sidebar_toggle: () => Maoka.Component,
) => Maoka.Jab<() => Maoka.Component> = (command_palette_toggle, sidebar_toggle) => () => {
	return () => activity_bar({ command_palette_toggle, sidebar_toggle })
}
