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

import { BehaviorSubject } from "rxjs"

import {
	MetadataCommand,
	MetadataManager,
	MetadataQuery,
	MetadataRepository,
	RemoteMetadataRepository,
	type TMetadata,
	type TMetadataQuery,
} from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"
import { noop } from "@ordo-pink/tau"

import { type TInitCtx } from "../frontend-client.types"

type TInitMetadataFn = (
	params: Pick<TInitCtx, "auth$" | "logger" | "commands" | "hosts" | "user_query" | "fetch">,
) => { metadata_query: TMetadataQuery }
export const init_metadata: TInitMetadataFn = ({
	auth$,
	logger,
	commands,
	hosts,
	user_query,
	fetch,
}) => {
	logger.debug("Initialising metadata...")

	metadata$.subscribe()

	const metadata_repository = MetadataRepository.of(metadata$)
	const remote_metadata_repository = RemoteMetadataRepository.of(hosts.dt, fetch)

	const metadata_query = MetadataQuery.of(metadata_repository)
	const metadata_command = MetadataCommand.of(metadata_repository, metadata_query, user_query)

	commands.on<cmd.data.add_labels>("data.metadata.add_label", ({ fsid, labels }) =>
		metadata_command.add_labels(fsid, ...labels),
	)

	commands.on<cmd.data.remove_labels>("data.metadata.remove_label", ({ fsid, labels }) =>
		metadata_command.remove_labels(fsid, ...labels),
	)

	commands.on<cmd.data.create>("data.metadata.create", metadata_command.create)

	commands.on<cmd.data.move>("data.metadata.move", ({ fsid, parent }) =>
		metadata_command.set_parent(fsid, parent),
	)

	commands.on<cmd.data.remove>("data.metadata.remove", fsid => metadata_command.remove(fsid))

	commands.on<cmd.data.add_links>("data.add_links", ({ fsid, links }) =>
		metadata_command.add_links(fsid, ...links),
	)

	commands.on<cmd.data.remove_links>("data.metadata.remove_links", ({ fsid, links }) =>
		metadata_command.remove_links(fsid, ...links),
	)

	commands.on<cmd.data.rename>("data.metadata.rename", ({ fsid, name }) =>
		metadata_command.set_name(fsid, name),
	)

	MetadataManager.of(metadata_repository, remote_metadata_repository, auth$, fetch).start(
		state_change =>
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

	return { metadata_query, metadata_command }
}

const metadata$ = new BehaviorSubject<TMetadata[] | null>(null)
