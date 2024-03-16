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

import { useHosts, useUser, useUserName } from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"

import Heading from "@ordo-pink/frontend-react-components/heading"
import Null from "@ordo-pink/frontend-react-components/null"
import UsedSpace from "@ordo-pink/frontend-react-components/used-space"

export default function FileExplorerCardComponent() {
	const user = useUser()
	const name = useUserName()!
	const hosts = useHosts()

	return Either.fromNullable(user).fold(Null, user => (
		<div className="flex size-full flex-col items-center justify-center">
			<div className="flex w-full max-w-lg flex-col items-center space-y-4">
				<div className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400 p-0.5 shadow-lg">
					<img
						src={`${hosts.staticHost}/logo.png`}
						alt="avatar"
						className="h-16 rounded-full bg-white md:h-20 dark:from-stone-900 dark:via-zinc-900 dark:to-neutral-900"
					/>
				</div>
				<div className="flex w-full max-w-md flex-col space-y-1 md:space-y-2">
					<Heading level="2" trim styledFirstLetter>
						{name.fullName || user.email}
					</Heading>
					<UsedSpace />
				</div>
			</div>
		</div>
	))
}
