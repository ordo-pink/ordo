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

import { useEffect } from "react"

import { useCommands, useRouteParams, useUserAchievements } from "@ordo-pink/frontend-react-hooks"

import { fromNullableE, swapE } from "@ordo-pink/either"

import Card from "@ordo-pink/frontend-react-components/card"
import Link from "@ordo-pink/frontend-react-components/link"
import Null from "@ordo-pink/frontend-react-components/null"
import ProgressBar from "@ordo-pink/frontend-react-components/progress-bar"

import Achievements from "../components/achievements.component"
import { translateCategory } from "../fns/translate-category"

export default function AchievementsWorkspace() {
	const { category } = useRouteParams<{ category: Achievements.AchievementCategory }>()
	const commands = useCommands()
	const achievements = useUserAchievements()

	useEffect(() => {
		commands.emit<cmd.application.setTitle>("application.set-title", "Достижения")
	}, [commands])

	const visibleAchievements = category
		? achievements.filter(achievement => achievement.category === category)
		: achievements.slice()

	const completedAchievements = visibleAchievements.filter(a => a.completedAt != null)

	const categories = Array.from(
		new Set(achievements.reduce((acc, v) => acc.concat(v.category), [] as string[])),
	).sort((a, b) => a.localeCompare(b)) as Achievements.AchievementCategory[]

	return (
		<div className="flex flex-col items-center space-y-4 p-4 sm:p-12">
			{fromNullableE(category)
				.pipe(swapE())
				.fold(Null, () => (
					<div className="w-full max-w-3xl">
						<Card>
							<div className="container mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
								{categories.map(category => (
									<div key={category}>
										<Link
											className="!text-inherit !no-underline"
											href={`/achievements/${category}`}
										>
											<ProgressBar
												total={achievements.filter(a => a.category === category).length}
												current={
													achievements.filter(a => a.category === category && a.completedAt != null)
														.length
												}
												text={translateCategory(category)}
											/>
										</Link>
									</div>
								))}
							</div>
							<ProgressBar
								total={visibleAchievements.length}
								current={completedAchievements.length}
								text="Общий прогресс"
							/>
						</Card>
					</div>
				))}

			<div className="w-full max-w-3xl">
				<Achievements
					achievements={visibleAchievements}
					max={!category ? 5 : undefined}
					title={category ? translateCategory(category) : "Последние достижения"}
				/>
			</div>
		</div>
	)
}
