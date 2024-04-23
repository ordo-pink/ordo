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

export default function DataLabel({ children }: PropsWithChildren) {
	return (
		<div className="whitespace-nowrap rounded-md bg-neutral-200 px-1 py-0.5 text-xs text-neutral-500 shadow-sm transition-all duration-300 hover:ring-1 hover:ring-purple-500 dark:bg-neutral-900">
			{children}
		</div>
	)
}

export const DataLabelInline = ({ children }: PropsWithChildren) => {
	return (
		<span className="inline-block whitespace-nowrap rounded-md bg-neutral-200 px-1 py-0.5 text-xs text-neutral-500 shadow-sm transition-all duration-300 hover:ring-1 hover:ring-purple-500 dark:bg-neutral-900">
			{children}
		</span>
	)
}
