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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { invokers0 } from "@ordo-pink/oath"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

export const RenderPicker = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ refresh, use }) => {
		const metadata_fsid = metadata.get_fsid()
		const metadata_type = metadata.get_type()

		let fa: Ordo.FileAssociation.Instance | null = null

		const content_query = use(MaokaOrdo.Jabs.get_content_query)
		const content0 = content_query.get(metadata_fsid, "text")

		ordo_app_state.zags.cheat("functions.file_assocs", fas => {
			if (fa) return

			fa = fas.find(fa => fa.types.some(t => t.name === metadata_type)) ?? null

			if (fa) refresh()
		})

		// TODO Unsupported file component
		return async () => {
			const content = await content0.invoke(invokers0.or_else(() => null))

			if (!fa || !fa.render) return

			const is_editable = true // TODO Check if user has edit rights
			const is_embedded = false

			return fa.render({ metadata, content, is_editable, is_embedded })
		}
	})
