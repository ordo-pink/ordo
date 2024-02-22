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

import { TUsedSpaceViewProps } from "./used-space.types"

export const UsedSpaceView = ({
	progress,
	percentage: progressPercentage,
}: TUsedSpaceViewProps) => {
	const progressBarStyle = { width: `${progressPercentage}%` }

	// --- Translations ---
	const tFileLimit = "Лимит файлов"

	return (
		<div className="w-full max-w-md">
			<div className="flex w-full items-center justify-between">
				<div className="truncate text-xs">{tFileLimit}</div>
				<div className="text-xs">{progress}</div>
			</div>
			<div className="w-full rounded-full bg-neutral-300 shadow-inner dark:bg-neutral-700">
				<div
					className="h-1 rounded-full bg-gradient-to-r from-slate-500 to-neutral-500"
					style={progressBarStyle}
				/>
			</div>
		</div>
	)
}
