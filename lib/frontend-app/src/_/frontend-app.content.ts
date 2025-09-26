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

import { Metadata, NOTIFICATION_TYPE, rrr } from "@ordo-pink/_core"
import { is_instance_of, is_string } from "@ordo-pink/_tau"
import { R } from "@ordo-pink/oss-result"
import { console_logger } from "@ordo-pink/logger"
import { create } from "@ordo-pink/oss-zags"
import { oath } from "@ordo-pink/oss-oath"
import { sweech } from "@ordo-pink/oss-sweech"

import { ContentQuery } from "./data/content/content-query.impl"
import { ContentRepository } from "./data/content/content-repository.impl"
import { PersistenceStrategyContentIndexedDB } from "./data/content/content-persistence-strategy-indexed-db"
import { PersistenceStrategyContentOrdoBackend } from "./data/content/content-persistence-strategy-ordo-backend"
import { ordo_app_state } from "../app.state"

const INDEXEDDB_NAME = "ordo"
const INDEXEDDB_OBJECT_STORE_NAME = "ordo_db"
const INDEXEDDB_OBJECT_STORE_VERSION = 3

type TF = () => { content_repository: Ordo.Content.Repository; get_content_query: (fid: symbol) => Ordo.Content.Query }
export const init_content: TF = () => {
	const logger = ordo_app_state.zags.select("logger")
	const commands = ordo_app_state.zags.select("commands")
	const known_functions = ordo_app_state.zags.select("known_functions")
	const app_fid = ordo_app_state.zags.select("constants.app_fid")
	const dt_host = ordo_app_state.zags.select("hosts.dt")
	const fetch = ordo_app_state.zags.select("fetch")

	logger.debug("🟡 Initialising content...")

	const local_strategy = PersistenceStrategyContentIndexedDB.Of(
		INDEXEDDB_NAME,
		INDEXEDDB_OBJECT_STORE_NAME,
		INDEXEDDB_OBJECT_STORE_VERSION,
		indexed_db => () => {
			const db = indexed_db.result
			if (!db.objectStoreNames.contains(INDEXEDDB_OBJECT_STORE_NAME)) db.createObjectStore(INDEXEDDB_OBJECT_STORE_NAME)
		},
	)

	const auth$ = create({ user: null as Ordo.User.Current.Instance | null })
	ordo_app_state.zags.cheat("user", user => auth$.update("user", () => user))

	const remote_strategy = PersistenceStrategyContentOrdoBackend.Of(dt_host, fetch)
	const content_repository = ContentRepository.Of(auth$, local_strategy, remote_strategy)

	// TODO Extract for common error handling
	const alert_rrr = (rrr: Ordo.Rrr) => {
		if (rrr.debug && rrr.debug.length) logger.error(...rrr.debug)

		commands.emit("cmd.application.notification.show", {
			message: rrr.message as Ordo.I18N.TranslationKey,
			duration: 15,
			title: `t.common.error.${rrr.key.toLocaleLowerCase()}` as any,
			type: NOTIFICATION_TYPE.RRR,
		})

		throw rrr
	}

	// TODO Update metadata size
	commands.on("cmd.content.set", ({ fsid, content }) => {
		const metadata_query = ordo_app_state.zags.select("queries.metadata")
		const size = get_size(content)
		const user = ordo_app_state.zags.select("user")

		if (size > 0) {
			// TODO Find a better way to check whether metadata should be updated
			void metadata_query
				.get_by_fsid(fsid)
				.pipe(R.ops.chain(R.FromNullable))
				.pipe(R.ops.chain(metadata => R.If(metadata?.get_size() !== size)))
				.cata(
					R.catas.if_ok(() =>
						content_repository
							.put(user?.get_uid() ?? null, fsid, content)
							.pipe(oath.ops.tap(() => commands.emit("cmd.metadata.set_size", { fsid, size })))
							.cata(oath.catas.or_else(alert_rrr)),
					),
				)
		}
	})

	commands.on("cmd.content.remove", fsid => commands.emit("cmd.metadata.remove", fsid))

	commands.on("cmd.content.upload", async ({ content, type, name, parent }) => {
		const metadata_query = ordo_app_state.zags.select("queries.metadata")
		const size = get_size(content)

		let metadata = metadata_query
			.get_by_name(name, parent, { show_hidden: true })
			.pipe(R.ops.chain(R.FromNullable))
			.cata(R.catas.or_else(() => null))

		if (!metadata) {
			metadata = await commands
				.naga("cmd.metadata.create", { name, parent, type, size })
				.pipe(
					oath.ops.map(() =>
						metadata_query
							.get_by_name(name, parent, { show_hidden: true })
							.pipe(R.ops.chain(R.FromNullable))
							.cata(R.catas.or_else(() => null)),
					),
				)
				.cata(oath.catas.to_promise())
		} else {
			await commands.naga("cmd.metadata.set_size", { fsid: metadata.get_fsid(), size }).cata(oath.catas.to_promise())
		}

		if (!Metadata.Validations.is_metadata(metadata))
			return alert_rrr(rrr.codes.enoent("Metadata creation failed", { type, name, parent }))

		const user = ordo_app_state.zags.select("user")

		return content_repository.put(user?.get_uid() || null, metadata.get_fsid(), content).cata(oath.catas.or_else(alert_rrr))
	})

	logger.debug("🟢 Initialised content.")

	const get_content_query = (fid: symbol) =>
		ContentQuery.Of(content_repository, permission =>
			R.If(known_functions.has_permissions(fid, { queries: [permission] }), {
				F: () => {
					const e = rrr.codes.eperm(`ContentQuery permission RRR. Did you forget to request query permission '${permission}'?`)
					console_logger.error(e.message)
					return e
				},
			}),
		)

	ordo_app_state.zags.update("queries.content", () => get_content_query(app_fid))

	// TODO Extract and reuse check_query_permission
	return { content_repository, get_content_query }
}

// --- Internal ---

// TODO Move to tau
const is_array_buffer = (x: unknown): x is ArrayBuffer => is_instance_of(ArrayBuffer, x)

const get_size = (content: Ordo.Content.Instance) =>
	sweech
		.match(content)
		.case(is_string, () => (content as ArrayBuffer).byteLength)
		.case(is_array_buffer, () => (content as ArrayBuffer).byteLength)
		.default(() => 0)
