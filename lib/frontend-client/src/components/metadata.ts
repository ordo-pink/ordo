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
	CacheMetadataRepository,
	ContextMenuItemType,
	Metadata,
	MetadataCommand,
	MetadataQuery,
	MetadataRepository,
	NotificationType,
	RRR,
} from "@ordo-pink/core"
import { is_string, noop } from "@ordo-pink/tau"
import { MetadataManager } from "@ordo-pink/managers"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

import { type TInitCtx } from "../frontend-client.types"

type TInitMetadataFn = (
	params: Pick<
		TInitCtx,
		"auth$" | "logger" | "commands" | "hosts" | "user_query" | "fetch" | "known_functions"
	>,
) => {
	metadata_query: Ordo.Metadata.Query
	get_metadata_query: (fid: symbol) => Ordo.CreateFunction.GetMetadataQueryFn
}
export const init_metadata: TInitMetadataFn = ({
	auth$,
	logger,
	known_functions,
	commands,
	hosts,
	user_query,
	fetch,
}) => {
	logger.debug("🟡 Initialising metadata...")

	const metadata_repository = MetadataRepository.Of(metadata$)
	const remote_metadata_repository = CacheMetadataRepository.Of(hosts.dt, fetch)

	const metadata_query = MetadataQuery.Of(metadata_repository)
	const metadata_command = MetadataCommand.Of(metadata_repository, metadata_query, user_query)

	const Err = (rrr: Ordo.Rrr) =>
		commands.emit("cmd.application.notification.show", {
			message: (String(rrr.debug) as any) ?? "",
			duration: 15,
			title: `t.common.error.${rrr.key.toLocaleLowerCase()}` as any,
			type: NotificationType.RRR,
		})

	commands.on("cmd.metadata.add_labels", ({ fsid, labels }) =>
		metadata_command.add_labels(fsid, ...labels).cata({ Ok: noop, Err }),
	)

	// TODO Use metadata_commands directly for changing size
	commands.on("cmd.metadata.set_size", ({ fsid, size }) =>
		metadata_command.set_size(fsid, size).cata({ Ok: noop, Err }),
	)

	commands.on("cmd.metadata.remove_labels", ({ fsid, labels }) =>
		metadata_command.remove_labels(fsid, ...labels).cata({ Ok: noop, Err }),
	)

	commands.on("cmd.metadata.set_property", ({ fsid, key, value }) =>
		metadata_command.set_property(fsid, key, value),
	)

	commands.on("cmd.metadata.create", params => {
		metadata_command.create(params).cata({ Ok: noop, Err })
	})

	commands.on("cmd.metadata.move", ({ fsid, new_parent }) =>
		metadata_command.set_parent(fsid, new_parent).cata({ Ok: noop, Err }),
	)

	commands.on("cmd.metadata.remove", fsid => metadata_command.remove(fsid).cata({ Ok: noop, Err }))

	commands.on("cmd.metadata.add_links", ({ fsid, links }) =>
		metadata_command.add_links(fsid, ...links).cata({ Ok: noop, Err }),
	)

	commands.on("cmd.metadata.remove_links", ({ fsid, links }) =>
		metadata_command.remove_links(fsid, ...links).cata({ Ok: noop, Err }),
	)

	commands.on("cmd.metadata.rename", ({ fsid, new_name }) =>
		metadata_command.set_name(fsid, new_name).cata({ Ok: noop, Err }),
	)

	commands.on("cmd.metadata.show_edit_labels_palette", fsid => {
		const show_labels_palette = () => {
			const current_labels = metadata_query
				.get_by_fsid(fsid)
				.pipe(Result.ops.chain(Result.FromOption))
				.pipe(Result.ops.map(metadata => metadata.get_labels()))
				.cata(Result.catas.or_else(() => [] as Ordo.Metadata.Label[]))

			const available_labels = metadata_query
				.get()
				.pipe(Result.ops.map(metadata => metadata.flatMap(item => item.get_labels())))
				.pipe(Result.ops.map(labels => labels.filter(label => !current_labels.includes(label))))
				.pipe(Result.ops.map(labels => [...new Set(labels)]))
				.cata(Result.catas.or_else(() => [] as Ordo.Metadata.Label[]))

			commands.emit("cmd.application.command_palette.show", {
				is_multiple: true,
				on_new_item: value => {
					commands.emit("cmd.metadata.add_labels", { fsid, labels: [value] })
					show_labels_palette()
				},
				items: available_labels.map(label => ({
					readable_name: (is_string(label)
						? label
						: label.readable_name) as Ordo.I18N.TranslationKey,
					on_select: () => commands.emit("cmd.metadata.add_labels", { fsid, labels: [label] }),
				})),
				max_items: 200,
				pinned_items: current_labels.map(label => ({
					readable_name: (is_string(label)
						? label
						: label.readable_name) as Ordo.I18N.TranslationKey,
					on_select: () => commands.emit("cmd.metadata.remove_labels", { fsid, labels: [label] }),
				})),
			})
		}

		show_labels_palette()
	})

	commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_edit_labels_palette",
		// TODO render_icon: div => div.appendChild(BsFileEarmarkPlus() as SVGSVGElement),
		readable_name: "t.common.metadata.show_edit_labels_palette", // TODO
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) || payload === "root",
		payload_creator: ({ payload }) =>
			Metadata.Validations.is_metadata(payload) ? payload.get_fsid() : null,
		type: ContextMenuItemType.CREATE,
	})

	MetadataManager.of(metadata_repository, remote_metadata_repository, auth$, fetch).start(
		state_change =>
			Switch.Match(state_change)
				.case("get-remote", () => commands.emit("cmd.application.background_task.start_loading"))
				.case("put-remote", () => commands.emit("cmd.application.background_task.start_saving"))
				.case(["get-remote-complete", "put-remote-complete"], () =>
					commands.emit("cmd.application.background_task.reset_status"),
				)
				.default(noop),
	)

	logger.debug("🟢 Initialised metadata.")

	return {
		metadata_query,
		get_metadata_query: fid => () =>
			Result.If(known_functions.has_permissions(fid, { queries: ["data.metadata_query"] }))
				.pipe(Result.ops.err_map(() => eperm(`get_metadata_query -> fid: ${String(fid)}`)))
				.pipe(Result.ops.map(() => metadata_query)),
	}
}

// --- Internal ---

const eperm = RRR.codes.eperm("init_metadata")

const metadata$ = new BehaviorSubject<Ordo.Metadata.Instance[] | null>([])
