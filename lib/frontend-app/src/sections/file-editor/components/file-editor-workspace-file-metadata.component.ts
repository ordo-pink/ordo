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

import { Input, Label, MetadataIcon, MetadataLink } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { R } from "@ordo-pink/result"
import { noop } from "@ordo-pink/tau"
import { oath } from "@ordo-pink/oath"

// TODO Refresh if metadata was changed from the outside
export const FileMetadata = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ refresh, use }) => {
		const fsid = metadata.get_fsid()
		const name = metadata.get_name()

		const metadata_query = use(MaokaOrdo.Jabs.get_metadata_query)
		const commands = use(MaokaOrdo.Jabs.get_commands)

		use(MaokaJabs.add_class("relative p-2 pt-12 flex flex-col gap-y-1"))

		use(
			MaokaJabs.listen("ondragenter", () => {
				use(MaokaJabs.add_class("bg-slate-500"))
			}),
		)

		use(
			MaokaJabs.listen("ondragleave", () => {
				use(MaokaJabs.remove_class("bg-slate-500"))
			}),
		)

		use(
			MaokaJabs.listen("ondragover", event => {
				event.preventDefault()
				use(MaokaJabs.add_class("bg-slate-500"))
			}),
		)

		use(
			MaokaDOM.Jabs.onmount(() => {
				use(
					MaokaJabs.listen("ondrop", event => {
						event.preventDefault()

						if (event.dataTransfer && event.dataTransfer.files) {
							const file = event.dataTransfer.files.item(0)

							file &&
								file
									.arrayBuffer()
									.then(content =>
										commands
											.naga("cmd.content.upload", { content, name: ".hero-image", parent: fsid, type: file.type })
											.pipe(
												oath.ops.and(() =>
													metadata_query
														.get_by_name(".hero-image", fsid, { show_hidden: true })
														.pipe(R.ops.chain(R.FromNullable))
														.cata({ Ok: m => oath.of(m), Err: oath.reject }),
												),
											)
											.pipe(
												oath.ops.and(m =>
													commands.naga("cmd.metadata.set_property", { fsid, key: "hero_image", value: m.get_fsid() }),
												),
											)
											.cata(oath.catas.unwrap()),
									)
									.catch(console.error)
									.then(() => refresh(), noop)
						}

						use(MaokaJabs.remove_class("bg-slate-500"))
					}),
				)
			}),
		)

		return () => {
			return [
				BackgroundImage(metadata),
				TitleSection(() => () => [
					MetadataIcon({ metadata }),
					Input.Text({
						transparent: true,
						custom_class:
							"hover:bg-gradient-to-br hover:from-neutral-100/50 hover:to-stone-100/50 hover:dark:from-neutral-700/50 hover:dark:to-stone-700/50 rounded-sm font-extrabold !text-2xl cursor-text !w-full !shadow-none",
						initial_value: name,
						on_input: event => {
							const target = event.target as HTMLInputElement
							commands.emit("cmd.metadata.rename", { fsid, new_name: target.value })
						},
					}),
				]),
				LabelsSection(fsid),
				OutgoingLinksSection(fsid),
			]
		}
	})

const BackgroundImage = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ refresh, use }) => {
		const metadata_query = use(MaokaOrdo.Jabs.get_metadata_query)
		const content_query = use(MaokaOrdo.Jabs.get_content_query)
		const hero_image_fsid = metadata.get_property("hero_image")

		let src: string | undefined

		use(
			MaokaDOM.Jabs.onmount(() => {
				const fetch_background0 = metadata_query
					.get_by_fsid(hero_image_fsid, { show_hidden: true })
					.pipe(R.ops.chain(R.FromNullable))
					.pipe(R.ops.map(m => ({ fsid: m.get_fsid(), uid: m.get_created_by(), type: m.get_type() })))
					.cata({ Ok: ctx => oath.of<typeof ctx, void>(ctx), Err: () => oath.reject(void 0) })
					.pipe(
						oath.ops.chain(({ uid, fsid, type }) =>
							content_query.get(uid!, fsid).pipe(oath.ops.map(ab => new Blob([ab as ArrayBuffer], { type }))),
						),
					)
					.pipe(oath.ops.and(blob => URL.createObjectURL(blob)))
					.pipe(
						oath.ops.and(url => {
							src = url
						}),
					)

				fetch_background0
					.cata(oath.catas.to_promise())
					.then(() => refresh())
					.catch(() => {
						// src = void 0
					})

				return () => {
					fetch_background0.cancel("Fetch task restarted with new updates")
					if (src) URL.revokeObjectURL(src)
				}
			}),
		)

		return () =>
			src
				? Maoka.create("img", ({ use }) => {
						use(MaokaJabs.set_class("absolute top-0 left-0 right-0 bottom-0 h-full object-cover w-full -z-10"))
						use(MaokaJabs.set_attribute("src", src))
						use(MaokaDOM.Jabs.onmount(() => () => URL.revokeObjectURL(src!)))
					})
				: void 0
	})

// TODO Move to center, add info label
const LabelsSection = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("div", ({ use }) => {
		const label_section =
			"flex flex-wrap px-1 gap-1 cursor-pointer rounded-sm hover:bg-gradient-to-br hover:from-neutral-100/50 hover:to-stone-100/50 hover:dark:from-neutral-700/50 hover:dark:to-stone-700/50 py-1 min-h-7"

		use(MaokaJabs.set_class(label_section))
		use(MaokaJabs.listen("onclick", () => handle_click()))

		const commands = use(MaokaOrdo.Jabs.get_commands)
		const get_metadata = use(MaokaOrdo.Jabs.Metadata.get_by_fsid$(fsid))

		const handle_click = () => commands.emit("cmd.metadata.show_edit_labels_palette", fsid)

		return () => {
			const metadata = get_metadata()
			const labels = metadata?.get_labels() ?? []

			return labels.length > 0
				? metadata?.get_labels().map(label => Label(label, commands.emit, metadata))
				: ActionPlaceholder(() => () => "Add labels...") // TODO Translations
		}
	})

const ActionPlaceholder = MaokaStyled.Tags.div("text-sm text-neutral-400 dark:text-neutral-600")
const TitleSection = MaokaStyled.Tags.div("flex w-full space-x-2 items-center text-2xl")

const OutgoingLinksSection = (fsid: Ordo.Metadata.FSID) =>
	Maoka.create("div", ({ use }) => {
		const label_section =
			"flex px-1 flex-wrap gap-2 cursor-pointer rounded-sm hover:bg-gradient-to-br hover:from-neutral-100/50 hover:to-stone-100/50 hover:dark:from-neutral-700/50 hover:dark:to-stone-700/50 py-1 min-h-7"

		use(MaokaJabs.set_class(label_section))
		use(MaokaJabs.listen("onclick", () => handle_click()))

		const commands = use(MaokaOrdo.Jabs.get_commands)
		const get_links = use(MaokaOrdo.Jabs.Metadata.get_outgoing_links$(fsid))

		const handle_click = () => commands.emit("cmd.metadata.show_edit_links_palette", { fsid, type: "outgoing" })

		return () => {
			const links = get_links()

			return links.length > 0
				? links.map(metadata => MetadataLink({ metadata, children: metadata.get_name() }))
				: ActionPlaceholder(() => () => "Add outgoing links...") // TODO Translations
		}
	})
