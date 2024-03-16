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

type P = { achievement: Achievements.AchievementDAO }
export default function Achievement({ achievement }: P) {
	const isCompleted = !!achievement.completedAt

	return (
		<div className="flex flex-col items-center p-2 space-y-2 bg-gradient-to-br rounded-lg from-neutral-300 to-neutral-300 sm:flex-row sm:space-x-2 sm:space-y-0 dark:from-neutral-800 dark:via-neutral-800 dark:to-stone-800">
			<div className={`shrink-0 rounded-md shadow-md ${!isCompleted && "grayscale"}`}>
				<img
					className="rounded-md size-24"
					src={achievement.image}
					alt={achievement.title}
					title={achievement.title}
				/>
			</div>
			<div className="flex flex-col justify-center space-y-1 w-full grow">
				<div className="w-full text-base font-bold text-center sm:text-lg">{achievement.title}</div>
				<div className="w-full text-sm text-center sm:text-base">{achievement.description}</div>
			</div>

			<div className="flex flex-col justify-end items-center pr-2 h-full text-xs text-neutral-500 sm:items-end">
				{achievement.completedAt ? new Date(achievement.completedAt).toLocaleDateString() : ""}
			</div>
		</div>
	)
}
