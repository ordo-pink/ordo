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

// import { get_commands, get_translations, ordo_context } from "@ordo-pink/maoka-ordo-jabs"
// import { BS_FILE_EARMARK_X } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"

export const RemoveFileModal = (/*ctx: Ordo.CreateFunction.Params, fsid: Ordo.Metadata.FSID*/) =>
	Maoka.styled("div", {})(() => "YAY")
// 	Maoka.create("div", ({ use }) => {
// 		use(ordo_context.provide(ctx))
// 		use(set_class("p-4 w-96 flex flex-col gap-y-2"))

// 		const { t } = use(get_translations)
// 		const commands = use(get_commands)

// 		const t_title = t("t.file_explorer.modals.remove_file.title")
// 		const t_message = t("t.file_explorer.modals.remove_file.message")

// 		return () => [
// 			Header([TitleIcon, Title(t_title)]),
// 			Body(t_message),
// 			Footer([
// 				CancelBtn,
// 				OkBtn(() => {
// 					commands.emit("cmd.data.metadata.remove", fsid)
// 					commands.emit("cmd.application.modal.hide")
// 				}),
// 			]),
// 		]
// 	})

// const Header = (children: TMaokaChildren) =>
// 	create("div", ({ use }) => {
// 		use(set_class("flex gap-x-2 items-center"))
// 		return () => children
// 	})

// const TitleIcon = create("div", ({ use }) => use(set_inner_html(BS_FILE_EARMARK_X)))

// const Title = (children: TMaokaChildren) =>
// 	create("h2", ({ use }) => {
// 		use(set_class("text-lg"))
// 		return () => children
// 	})

// const Body = (children: TMaokaChildren) => create("div", () => () => children)

// const Footer = (children: TMaokaChildren) =>
// 	create("div", ({ use }) => {
// 		use(set_class("flex justify-end items-center gap-x-2"))

// 		return () => children
// 	})

// const OkBtn = (on_click: (event: MouseEvent) => void) =>
// 	create("button", ({ use }) => {
// 		use(set_class("border rounded-md px-4 py-1 text-sm"))
// 		use(listen("onclick", on_click))

// 		return () => "OK"
// 	})

// const CancelBtn = create("button", ({ use }) => {
// 	const commands = use(get_commands)

// 	use(set_class("px-4 py-1 text-sm"))
// 	use(listen("onclick", () => commands.emit("cmd.application.modal.hide")))

// 	return () => "Cancel"
// })
