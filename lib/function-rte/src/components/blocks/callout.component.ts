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

import {
	BsCheckCircle,
	BsCircle,
	BsErrorCircle,
	BsExclamationCircle,
	BsInfoCircle,
	BsQuestionCircle,
	BsThreeDotsVertical,
} from "@ordo-pink/frontend-icons"
import { Input } from "@ordo-pink/maoka-components"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"
import { Switch } from "@ordo-pink/switch"

import { CalloutType } from "../../rte.constants"
import { Inline } from "../inline.component"
import { RTE } from "../../rte"
import { type TRTECalloutNode } from "../../rte.types"

// TODO Copy CSS
export const Callout = (node: TRTECalloutNode, index: number) =>
	StyledCallout(({ refresh }) => {
		let node_type = node.callout_type
		let title = node.title

		return () => {
			const card_type = get_readable_type(node_type)
			const CalloutCard = create_callout_card(card_type)

			return CalloutCard(() => () => [
				// TODO Clickable emoji icon
				get_callout_icon(node.callout_type),
				StyledCalloutCardBody(() => () => [
					StyledTitleOptionsContainer(() => () => [
						Input.Text({
							initial_value: title,
							on_input: event => {
								title = (event.target as HTMLInputElement).value
							},
							on_blur: () => {
								RTE.$.update("content", content => {
									if (RTE.Guards.is_rte_callout_node(content[index])) {
										const content_copy = [...content]
										content_copy[index].title = title
										return content_copy
									}

									return content
								})
							},
							placeholder: "Enter title",
							custom_class: "rte_blocks_callout-card_title",
							transparent: true,
						}),
						StyledCalloutOptions(({ use }) => {
							const commands = use(MaokaOrdo.Jabs.get_commands)

							use(MaokaJabs.listen("onclick", event => handle_click(event)))

							const handle_click = (event: MouseEvent) => {
								event.stopPropagation()

								const on_select = (item: Ordo.CommandPalette.Item<CalloutType>) => {
									RTE.$.update("content", content => {
										const content_copy = [...content]
										if (RTE.Guards.is_rte_callout_node(content_copy[index])) {
											content_copy[index].callout_type = item.value
											return content_copy
										}

										return content
									})

									node_type = item.value
									refresh()
								}

								const items = [] as Ordo.CommandPalette.Item[]

								for (let i = 0; i < Number(CalloutType.length); i++)
									// TODO Icon, color label custom info, readable_name
									items.push({ readable_name: get_readable_type(i) as Ordo.I18N.TranslationKey, value: i })

								commands.emit("cmd.application.command_palette.show", { items, on_select })
							}

							return () => BsThreeDotsVertical("cursor-pointer")
						}),
					]),
					StyledCalloutMessage(() => () => node.children.map((child, inline_index) => Inline(child, index, inline_index))),
				]),

				// OrdoNotificationHideButton({ id, type }),
			])
		}
	})

// --- Internal ---

const StyledTitleOptionsContainer = MaokaStyled.Tags.div("flex justify-between items-center")
const StyledCallout = MaokaStyled.Tags.div("rte_blocks_callout")
const StyledCalloutCardBody = MaokaStyled.Tags.div("rte_blocks_callout-card_body")
const StyledCalloutMessage = MaokaStyled.Tags.p()
const StyledCalloutOptions = MaokaStyled.Tags.div()
const create_callout_card = (card_type: string) => MaokaStyled.Tags.div(`rte_blocks_callout-card ${card_type}`)

const get_callout_icon = (type: CalloutType) =>
	Switch.Match(type)
		.case(CalloutType.INFO, () => BsInfoCircle("text-sky-500"))
		.case(CalloutType.QUESTION, () => BsQuestionCircle("text-violet-500"))
		.case(CalloutType.RRR, () => BsErrorCircle("text-rose-500"))
		.case(CalloutType.SUCCESS, () => BsCheckCircle("text-emerald-500"))
		.case(CalloutType.WARN, () => BsExclamationCircle("text-amber-500"))
		.default(() => BsCircle("text-neutral-500"))

const get_readable_type = (type: CalloutType) =>
	Switch.Match(type)
		.case(CalloutType.INFO, () => "info")
		.case(CalloutType.QUESTION, () => "question")
		.case(CalloutType.RRR, () => "rrr")
		.case(CalloutType.SUCCESS, () => "success")
		.case(CalloutType.WARN, () => "warn")
		.default(() => "default")
