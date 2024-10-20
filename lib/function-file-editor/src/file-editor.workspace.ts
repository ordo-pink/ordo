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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Metadata } from "@ordo-pink/core"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { invokers0 } from "@ordo-pink/oath"

export const FileEditorWorkspace = (ctx: Ordo.CreateFunction.Params) => {
	return Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))

		const get_route_params = use(MaokaOrdo.Jabs.RouteParams)
		const metadata_query = use(MaokaOrdo.Jabs.MetadataQuery)

		return () =>
			R.FromNullable(get_route_params())
				.pipe(R.ops.chain(({ fsid }) => R.FromNullable(fsid)))
				.pipe(R.ops.chain(check_is_fsid_valid))
				.pipe(R.ops.chain(metadata_query.get_by_fsid))
				.pipe(R.ops.chain(R.FromOption))
				.cata({
					Ok: metadata => [TitleSetter(metadata), RenderPicker(metadata)],
					Err: () => TitleSetter(null), // TODO No selected file component
				})
	})
}

// --- Internal ---

const RenderPicker = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", async ({ use, refresh, element, on_unmount }) => {
		let file_associations: Ordo.FileAssociation.Instance[] = []

		const metadata_fsid = metadata.get_fsid()
		const metadata_type = metadata.get_type()

		const content_query = use(MaokaOrdo.Jabs.ContentQuery)

		const content0 = content_query.get(metadata_fsid)
		const content = await content0.invoke(invokers0.or_else(() => null))

		const $ = use(MaokaOrdo.Jabs.FileAssociations$)
		const handle_update = (value: Ordo.FileAssociation.Instance[]) => {
			if (file_associations.length !== value.length) {
				file_associations = value
				void refresh()
			}
		}

		on_unmount(() => content0.cancel())

		use(MaokaOrdo.Jabs.subscribe($, handle_update))

		// TODO Unsupported file component
		// TODO Avoid glitches with double rendering
		return async () => {
			const file_association = file_associations.find(fa =>
				fa.types.some(t => t.name === metadata_type),
			)

			if (file_association && file_association.render) {
				await file_association.render({
					div: element as unknown as HTMLDivElement,
					metadata,
					content,
					is_editable: true,
					is_embedded: false,
					is_loading: false,
				})
			}
		}
	})

const TitleSetter = (metadata: Ordo.Metadata.Instance | null) =>
	Maoka.create("div", ({ use }) => {
		const metadata_query = use(MaokaOrdo.Jabs.MetadataQuery)
		const { emit } = use(MaokaOrdo.Jabs.Commands)

		return () =>
			get_metadata_with_ancestors(metadata, metadata_query)
				.pipe(R.ops.map(({ metadata, ancestors }) => get_path(ancestors, metadata)))
				.cata({
					Ok: p => set_title(emit, p),
					Err: () => set_title(emit, "TODO: Empty Editor Title"),
				})
	})

const check_is_fsid_valid = (str: string) =>
	R.If(Metadata.Validations.is_fsid(str), { T: () => str as Ordo.Metadata.FSID })

const get_metadata_with_ancestors = (
	metadata: Ordo.Metadata.Instance | null,
	metadata_query: Ordo.Metadata.Query,
) =>
	R.FromNullable(metadata)
		.pipe(R.ops.chain(metadata => metadata_query.get_ancestors(metadata.get_fsid())))
		.pipe(R.ops.map(ancestors => ({ metadata: metadata!, ancestors })))

const set_title = (emit: Ordo.Command.Commands["emit"], title: string) =>
	emit("cmd.application.set_title", `${title} | File Editor` as any)

// TODO: Move to metadata utils
const get_path = (ancestors: Ordo.Metadata.Instance[], metadata: Ordo.Metadata.Instance) =>
	Switch.OfTrue()
		.case(ancestors.length > 0, () =>
			ancestors
				.map(ancestor => ancestor.get_name())
				.join(" / ")
				.concat(" / ")
				.concat(metadata.get_name()),
		)
		.default(() => metadata.get_name())
