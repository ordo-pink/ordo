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
	Metadata,
	MetadataQuery,
	MetadataRepository,
	RRR,
	type TMetadata,
	TMetadataDTO,
} from "@ordo-pink/data"
import { chain0, fromNullable0, reject0, rejectedMap0, resolve0, tap0, try0 } from "@ordo-pink/oath"
import { auth$ } from "@ordo-pink/frontend-stream-user"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getHosts } from "@ordo-pink/frontend-react-hooks"
import { getLogger } from "@ordo-pink/frontend-logger"

type P = { fid: symbol }
export const __initMetadata = ({ fid }: P) => {
	const logger = getLogger(fid)
	const commands = getCommands(fid)
	const hosts = getHosts()

	logger.debug("Initialising metadata...")

	const metadata$ = new BehaviorSubject<TMetadata[] | null>(null)
	metadata$.subscribe()
	const repo = MetadataRepository.of(metadata$)
	const query = MetadataQuery.of(repo)
	// const command = MetadataCommand.of(query, userQuery)

	const metadataManager = {
		fetchRemoteState: () => {
			const sub = auth$.subscribe(auth => {
				if (!auth) return

				const enoent = RRR.codes.enoent("MetadataManager")

				void fromNullable0(auth)
					.pipe(
						chain0(auth =>
							try0(() =>
								fetch(`${hosts.dtHost}`, {
									headers: { Authorization: `Bearer ${auth.accessToken}` },
								}).then(res => res.json()),
							),
						),
					)
					.pipe(tap0(logger.info, logger.error))
					.pipe(
						chain0(body =>
							body.success
								? resolve0(body.result as TMetadataDTO[])
								: reject0(body.error as string),
						),
					)
					.pipe(rejectedMap0(() => enoent(".fetchRemoteState")))
					.fork(
						() => {
							commands.emit<cmd.background.resetStatus>("background-task.reset-status")
						},
						result => {
							commands.emit<cmd.background.resetStatus>("background-task.reset-status")
							metadata$.next(result.map(item => Metadata.of(item)))
							logger.notice(metadata$.getValue())
							return sub.unsubscribe()
						},
					)
			})
		},
	}

	metadataManager.fetchRemoteState()

	logger.debug("Initialised metadata.")

	return query
}
