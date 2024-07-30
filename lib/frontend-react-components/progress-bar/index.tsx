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

import { get_percentage } from "@ordo-pink/tau"

type P = { total: number; current: number; text?: string }
export default function ProgressBar({ total, current, text }: P) {
	const progressPercentage = get_percentage(total, current)
	const progressBarStyle = { width: `${progressPercentage}%` }
	const progress = `${current} / ${total}`

	return (
		<div className="w-full">
			<div className="flex w-full items-center justify-between">
				<div className="truncate text-xs">{text}</div>
				<div className="text-xs">{progress}</div>
			</div>
			<div className="w-full rounded-sm bg-neutral-300 shadow-inner dark:bg-neutral-700">
				<div
					className="h-4 rounded-sm bg-gradient-to-r from-pink-500 to-purple-500"
					style={progressBarStyle}
				/>
			</div>
		</div>
	)
}
