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

import { DataRepository, FSID, PlainData } from "@ordo-pink/data"
import { GTD_DONE_LABEL, GTD_INBOX_LABEL, GTD_LABEL, GTD_PROJECT_LABEL } from "./gtd.constants"
import { Either } from "@ordo-pink/either"

export const GTDRepository = {
	getProjects: (data: PlainData[] | null) =>
		DataRepository.filterData(data, GTDRepository.isProject),
	getInbox: (data: PlainData[] | null) => DataRepository.filterData(data, GTDRepository.isInbox),
	getDone: (data: PlainData[] | null) => DataRepository.filterData(data, GTDRepository.isDone),
	isProject: (data: PlainData) =>
		[GTD_LABEL, GTD_PROJECT_LABEL].every(label => data.labels.includes(label)),
	isInbox: (data: PlainData) =>
		[GTD_LABEL, GTD_INBOX_LABEL].every(label => data.labels.includes(label)) &&
		!data.labels.includes(GTD_PROJECT_LABEL),
	isDone: (data: PlainData) => data.labels.includes(GTD_DONE_LABEL),
	getClosestProjectE: (data: PlainData[] | null, fsid: FSID) =>
		Either.fromNullable(DataRepository.getParentChain(data, fsid))
			.map(parentChain => parentChain.toReversed())
			.chain(parentChain =>
				Either.fromNullable(
					parentChain.length === 1 && GTDRepository.isProject(parentChain[0])
						? parentChain[0]
						: parentChain.reduce(
								(acc, v) => (!acc && GTDRepository.isProject(v) ? v : acc),
								null as PlainData | null,
							),
				),
			),
}
