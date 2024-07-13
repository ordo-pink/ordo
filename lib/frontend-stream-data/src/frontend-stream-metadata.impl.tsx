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

import { BehaviorSubject, type Observable } from "rxjs"

import {
	MetadataManager,
	MetadataQuery,
	MetadataRepository,
	RemoteMetadataRepository,
	type TMetadata,
	type TMetadataQuery,
} from "@ordo-pink/data"
import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { Switch } from "@ordo-pink/switch"
import { type THosts } from "@ordo-pink/core"
import { type TLogger } from "@ordo-pink/logger"
import { noop } from "@ordo-pink/tau"

type TInitMetadataStreamFn = (params: {
	logger: TLogger
	commands: Client.Commands.Commands
	hosts: THosts
	auth$: Observable<AuthResponse | null>
}) => { metadata_query: TMetadataQuery }
export const __init_metadata$: TInitMetadataStreamFn = ({ logger, commands, hosts, auth$ }) => {
	logger.debug("Initialising metadata...")

	const metadata$ = new BehaviorSubject<TMetadata[] | null>(null)
	// metadata$.subscribe()

	const l_repo = MetadataRepository.of(metadata$)
	const r_repo = RemoteMetadataRepository.of(auth$, hosts.dt)

	const metadata_query = MetadataQuery.of(l_repo)
	// const command = MetadataCommand.of(m_query, u_query)

	MetadataManager.of(l_repo, r_repo).start(state_change =>
		Switch.Match(state_change)
			.case("get-remote", () =>
				commands.emit<cmd.application.background_task.start_loading>(
					"application.background_task.start_loading",
				),
			)
			.case("put-remote", () =>
				commands.emit<cmd.application.background_task.start_saving>(
					"application.background_task.start_saving",
				),
			)
			.case(["get-remote-complete", "put-remote-complete"], () =>
				commands.emit<cmd.application.background_task.reset_status>(
					"application.background_task.reset_status",
				),
			)
			.default(noop),
	)

	logger.debug("Initialised metadata.")

	return { metadata_query }
}
