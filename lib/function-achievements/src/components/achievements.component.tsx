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

import Card from "@ordo-pink/frontend-react-components/card"

import Achievement from "./achievement.component"

type P = { achievements: Achievements.AchievementDAO[]; max?: number; title?: string }
export default function Achievements({ achievements, max, title }: P) {
	const visibleAchievements = achievements
		.filter(ach => {
			const previous = achievements.find(item => item.id === ach.previous)
			const next = achievements.find(item => item.previous === ach.id)

			// Show achievement since it's not in an achievement chain
			if (!next && !previous) return true
			// Show achievement since it's the first achievement in the chain and it is not obtained yet
			if (!previous && !ach.completedAt) return true
			// Hide achievement since previous steps were not completed
			if (previous && !previous.completedAt) return false
			// Show achievement since it's a current achievement to be obtained in the chain
			if (previous && previous.completedAt && !ach.completedAt) return true
			// Show achievement since it is obtained and it is the last achievement in the chain
			if (!next && ach.completedAt) return true
			// Show achievement since it's the most recent achievement in the chain obtained by the user
			if (next && !next.completedAt && ach.completedAt) return true
			// Show achievement since it's the most recent achievement in the chain obtained by the user
			if (next && !next.completedAt && !ach.completedAt) return true

			return false
		})
		.sort((a, b) =>
			!a.completedAt ? 1 : !b.completedAt ? -1 : a.completedAt > b.completedAt ? -1 : 1,
		)
		.slice(0, max)

	return (
		<Card title={title} className=" md:col-span-2">
			{visibleAchievements.map(achievement => (
				<Achievement key={achievement.id} achievement={achievement} />
			))}
		</Card>
	)
}
