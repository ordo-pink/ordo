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

import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { BsX } from "@ordo-pink/frontend-icons"
import { LabelColor } from "@ordo-pink/core"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { is_string } from "@ordo-pink/tau"

import "./label.css"

export const Label = (label: Ordo.Metadata.Label, emit: Ordo.Command.EmitFn, metadata?: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ use }) => {
		if (!label) return

		const readable_name = is_string(label) ? label : label.name
		const color = is_string(label) ? LabelColor.DEFAULT : label.color

		use(MaokaJabs.set_class(`label ${color_class[color]}`))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			event.stopPropagation()
			event.preventDefault()

			emit("cmd.metadata.show_edit_label_modal", label)
		}

		return () =>
			metadata
				? [TextWrapper(() => readable_name), RemoveLabel(metadata.get_fsid(), label, emit)]
				: TextWrapper(() => readable_name)
	})

// --- Internal ---

const TextWrapper = Maoka.styled("div")

const RemoveLabel = (fsid: Ordo.Metadata.FSID, label: Ordo.Metadata.Label, emit: Ordo.Command.EmitFn) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			event.stopPropagation()
			emit("cmd.metadata.remove_labels", { fsid, labels: [label] })
		}

		return () => BsX("label_remove") as TMaokaElement
	})

export const color_class = [
	"default",
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
	"", // <- equivalent to LabelColor enum length
] as const
