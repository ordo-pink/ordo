/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { NotificationType, rrr } from "@ordo-pink/core"
import { Result } from "@ordo-pink/result"
import { ZAGS } from "@ordo-pink/zags"
import { call_once } from "@ordo-pink/tau"
import { console_logger } from "@ordo-pink/logger"
import { oath } from "@ordo-pink/oath"

import { MetadataCommand } from "./data/metadata/metadata-command.impl"
import { MetadataQuery } from "./data/metadata/metadata-query.impl"
import { MetadataRepository } from "./data/metadata/metadata-repository.impl"
import { ordo_app_state } from "../app.state"

type TInitMetadataFn = (content_repository: Ordo.Content.Repository) => {
	metadata_repository: Ordo.Metadata.Repository
	get_metadata_query: (fid: symbol) => Ordo.Metadata.Query
}
export const init_metadata: TInitMetadataFn = call_once(content_repository => {
	const { logger, commands, known_functions, queries } = ordo_app_state.zags.unwrap()

	logger.debug("🟡 Initialising metadata...")

	const metadata_repository = MetadataRepository.Of(metadata_zags)
	// const remote_metadata_repository = CacheMetadataRepository.Of(hosts.dt, fetch)

	const app_metadata_query = MetadataQuery.Of(metadata_repository, () => Result.Ok(void 0))
	const metadata_command = MetadataCommand.Of(metadata_repository, app_metadata_query, queries.user)

	const alert_rrr = (rrr: Ordo.Rrr) => {
		if (rrr.debug && rrr.debug.length) logger.error(...rrr.debug)

		commands.emit("cmd.application.notification.show", {
			message: rrr.message as Ordo.I18N.TranslationKey,
			duration: 15,
			title: `t.common.error.${rrr.key.toLocaleLowerCase()}` as any,
			type: NotificationType.RRR,
		})

		throw rrr
	}

	commands.on("cmd.metadata.add_labels", ({ fsid, labels }) =>
		metadata_command.add_labels(fsid, ...labels).cata(Result.catas.or_else(alert_rrr)),
	)

	// TODO Use metadata_commands directly for changing size
	commands.on("cmd.metadata.set_size", ({ fsid, size }) =>
		metadata_command.set_size(fsid, size).cata(Result.catas.or_else(alert_rrr)),
	)

	commands.on("cmd.metadata.remove_labels", ({ fsid, labels }) =>
		metadata_command.remove_labels(fsid, ...labels).cata(Result.catas.or_else(alert_rrr)),
	)

	commands.on("cmd.metadata.set_property", ({ fsid, key, value }) =>
		metadata_command.set_property(fsid, key, value).cata(Result.catas.or_else(alert_rrr)),
	)

	commands.on("cmd.metadata.create", params => {
		metadata_command.create(params).cata(Result.catas.or_else(alert_rrr))
	})

	commands.on("cmd.metadata.move", ({ fsid, new_parent }) =>
		metadata_command.set_parent(fsid, new_parent).cata(Result.catas.or_else(alert_rrr)),
	)

	commands.on("cmd.metadata.remove", fsid => {
		const user = queries.user.get_current().cata(Result.catas.or_else(() => null))
		metadata_command.remove(fsid).cata(Result.catas.or_else(alert_rrr))
		content_repository
			.remove(user?.get_uid() ?? null, fsid)
			.cata(oath.catas.to_promise())
			.catch(alert_rrr)
	})

	commands.on("cmd.metadata.add_links", ({ fsid, links }) =>
		metadata_command.add_links(fsid, ...links).cata(Result.catas.or_else(alert_rrr)),
	)

	commands.on("cmd.metadata.remove_links", ({ fsid, links }) =>
		metadata_command.remove_links(fsid, ...links).cata(Result.catas.or_else(alert_rrr)),
	)

	commands.on("cmd.metadata.rename", ({ fsid, new_name }) =>
		metadata_command.set_name(fsid, new_name).cata(Result.catas.or_else(alert_rrr)),
	)

	commands.on("cmd.metadata.edit_label", ({ old_label, new_label }) =>
		metadata_command.update_label(old_label, new_label).cata(Result.catas.or_else(alert_rrr)),
	)

	const get_metadata_query = (fid: symbol) =>
		MetadataQuery.Of(metadata_repository, permission =>
			Result.If(known_functions.has_permissions(fid, { queries: [permission] }), {
				F: () => {
					const e = rrr.codes.eperm(`MetadataQuery permission RRR. Did you forget to request query permission '${permission}'?`)
					console_logger.error(e.message)
					return e
				},
			}),
		)

	ordo_app_state.zags.update("queries.metadata", () => app_metadata_query)

	logger.debug("🟢 Initialised metadata.")

	return { metadata_repository, get_metadata_query }
})

// --- Internal ---

const metadata_zags = ZAGS.Of<{ items: Ordo.Metadata.Instance[] | null }>({ items: null })
