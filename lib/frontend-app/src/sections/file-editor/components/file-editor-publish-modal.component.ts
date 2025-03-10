/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { Dialog } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { NotificationType } from "@ordo-pink/core"
import { invokers0 } from "@ordo-pink/oath"
// import { Result } from "@ordo-pink/result"

export const PublishMetadataModal = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("div", ({ use }) => {
		// let checked = false
		const pages_to_publish: Ordo.Metadata.FSID[] = [fsid]

		// const metadata_query = use(MaokaOrdo.Jabs.get_metadata_query)
		const commands = use(MaokaOrdo.Jabs.get_commands)
		const logger = use(MaokaOrdo.Jabs.get_logger)

		const action = () => {
			// if (checked)
			// 	metadata_query
			// 		.get_descendents(fsid)
			// 		.pipe(Result.ops.map(ds => ds.map(d => d.get_fsid())))
			// 		.pipe(Result.ops.map(ds => pages_to_publish.push(...ds)))

			pages_to_publish.forEach(
				fsid =>
					void commands.naga("cmd.metadata.publish", fsid).invoke(
						invokers0.or_else(rrr => {
							if (rrr.debug && rrr.debug.length) logger.error(...rrr.debug)

							commands.emit("cmd.application.notification.show", {
								message: rrr.message as Ordo.I18N.TranslationKey,
								duration: 15,
								title: `t.common.error.${rrr.key.toLocaleLowerCase()}` as any,
								type: NotificationType.RRR,
							})
						}),
					),
			)

			commands.emit("cmd.application.modal.hide")
		}

		return () =>
			Dialog({
				action_hotkey: "mod+enter",
				action_text: "Publish page",
				action,
				body: () =>
					BodyWrapper(() => () => [
						Info(
							() => () =>
								"Publishing a page will provide read only access to this page publicly. Even non-authenticated users will be able to see it.", // TODO i18n
						),
						// CheckboxInput({
						// 	label: "Publish nested files recursively?", // TODO i18n
						// 	checked,
						// 	on_change: () => {
						// 		checked = !checked
						// 	},
						// }),
					]),
				title: "Publish",
			})
	})

const Info = MaokaStyled.Tags.p("text-sm text-neutral-500")

const BodyWrapper = MaokaStyled.Tags.div("flex flex-col gap-2")
