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

import { keysOf } from "@ordo-pink/tau"

export const getc = <K extends string>(variables?: K[]): { [Key in K]: string } => {
	if (!variables) {
		return keysOf(Bun.env as Record<string, string>).reduce(
			(acc, key) => (key.startsWith("ORDO_") ? { ...acc, [key]: Bun.env[key] } : acc),
			{} as { [Key in K]: string },
		)
	}
	return variables.reduce(
		(env, variable) => {
			env[variable] = Bun.env[variable] ?? ""
			return env
		},
		{} as { [Key in K]: string },
	)
}
