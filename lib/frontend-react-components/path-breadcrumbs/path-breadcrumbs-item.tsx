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

import { AiFillFolder } from "react-icons/ai"
import { BsChevronRight } from "react-icons/bs"

type Props = {
	chunk: string
}

export const PathBreadcrumbsItem = ({ chunk }: Props) => {
	return (
		<div className="mb-2 mr-4 flex max-w-[5rem] shrink-0 items-center space-x-2 first-of-type:ml-0">
			<AiFillFolder className="shrink-0" />
			<div className="truncate">{chunk ? chunk : "/"}</div>
			<BsChevronRight className="shrink-0" />
		</div>
	)
}
