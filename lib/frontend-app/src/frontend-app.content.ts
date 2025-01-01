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

import { CacheContentRepository, ContentQuery, Metadata, NotificationType, RRR } from "@ordo-pink/core"
import { invokers0, ops0 } from "@ordo-pink/oath"
import { is_instance_of, is_string } from "@ordo-pink/tau"
import { ConsoleLogger } from "@ordo-pink/logger"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

import { ordo_app_state } from "../app.state"

type TF = () => { get_content_query: (fid: symbol) => Ordo.Content.Query }
export const init_content: TF = () => {
	const logger = ordo_app_state.zags.select("logger")
	const commands = ordo_app_state.zags.select("commands")
	const fetch = ordo_app_state.zags.select("fetch")
	const hosts = ordo_app_state.zags.select("hosts")
	const known_functions = ordo_app_state.zags.select("known_functions")

	logger.debug("🟡 Initialising metadata...")

	const remote_content_repository = CacheContentRepository.Of(hosts.dt, fetch)

	// TODO Extract for common error handling
	const Err = (rrr: Ordo.Rrr) => {
		logger.error("ERROR", rrr.debug)

		commands.emit("cmd.application.notification.show", {
			message: (String(rrr.debug) as any) ?? "",
			duration: 15,
			// TODO Error titles
			title: `t.common.error.${rrr.key.toLocaleLowerCase()}` as any,
			type: NotificationType.RRR,
		})
	}

	commands.on("cmd.content.set", ({ fsid, content }) => {
		const metadata_query = ordo_app_state.zags.select("queries.metadata")
		const size = get_size(content)

		if (size > 0) {
			// TODO Check if metadata exists
			void metadata_query.get_by_fsid(fsid).cata(
				R.catas.if_ok(() =>
					remote_content_repository
						.put(fsid, content, "")
						.pipe(ops0.tap(() => commands.emit("cmd.metadata.set_size", { fsid, size })))
						.invoke(invokers0.or_else(Err)),
				),
			)
		}
	})

	commands.on("cmd.content.upload", ({ content, type, name, parent }) => {
		const metadata_query = ordo_app_state.zags.select("queries.metadata")
		const size = get_size(content)

		const metadata = metadata_query
			.get_by_name(name, parent)
			.pipe(R.ops.chain(R.FromNullable))
			// TODO Check if error is enoent
			.pipe(R.ops.err_tap(() => commands.emit("cmd.metadata.create", { name, parent, type, size })))
			.pipe(R.ops.err_chain(() => metadata_query.get_by_name(name, parent)))
			.cata(R.catas.or_nothing())

		if (!Metadata.Validations.is_metadata(metadata)) {
			Err(enoent("Metadata creation failed", { type, name, parent }))
			return
		}

		const fsid = metadata.get_fsid()

		void remote_content_repository
			.put(metadata?.get_fsid(), content, "")
			.pipe(ops0.tap(() => commands.emit("cmd.metadata.set_size", { fsid, size })))
			.invoke(invokers0.or_else(Err))
	})

	logger.debug("🟢 Initialised metadata.")

	// TODO Extract and reuse check_query_permission
	return {
		get_content_query: fid =>
			ContentQuery.Of(remote_content_repository, permission =>
				R.If(known_functions.has_permissions(fid, { queries: [permission] }), {
					F: () => {
						const rrr = eperm(`ContentQuery permission RRR. Did you forget to request query permission '${permission}'?`)
						ConsoleLogger.error(rrr.debug?.join(" "))
						return rrr
					},
				}),
			),
	}
}

// --- Internal ---

const eperm = RRR.codes.eperm("init_content")
const enoent = RRR.codes.enoent("init_content")

const get_string_size = (str: string) => new Blob([str]).size

// TODO Move to tau
const is_array_buffer = (x: unknown): x is ArrayBuffer => is_instance_of(ArrayBuffer, x)

const get_size = (content: Ordo.Content.Instance) =>
	Switch.Match(content)
		.case(is_string, () => get_string_size(content as string))
		.case(is_array_buffer, () => (content as ArrayBuffer).byteLength)
		.default(() => 0)
