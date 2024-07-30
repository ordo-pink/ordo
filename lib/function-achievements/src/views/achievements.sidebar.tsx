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

import { useRouteParams, useUserAchievements } from "@ordo-pink/frontend-react-hooks"

import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"
import Null from "@ordo-pink/frontend-react-components/null"

import { translateCategory } from "../fns/translate-category"

export default function AchievementsSidebar() {
	const achievements = useUserAchievements()
	const { category } = useRouteParams<{ category: Achievements.AchievementCategory }>()
	const categories = Array.from(
		new Set(achievements.reduce((acc, v) => acc.concat(v.category), [] as string[])),
	).sort((a, b) => a.localeCompare(b)) as Achievements.AchievementCategory[]

	return (
		<div>
			<ActionListItem Icon={Null} current={!category} text="Главная" href="/achievements" />
			{categories.map(c => (
				<ActionListItem
					key={c}
					Icon={Null}
					current={category === c}
					text={translateCategory(c)}
					href={`/achievements/${c}`}
				/>
			))}
		</div>
	)
}
