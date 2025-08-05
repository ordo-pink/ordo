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

import { maoka, maoka_dom } from "@ordo-pink/oss-maoka"
import { MODAL } from "@ordo-pink/sdk-client"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { sweech } from "@ordo-pink/oss-sweech"

import { modal$ } from "../modal.state"

export const modal = maoka.create("div", ({ use }) => {
	let onunmount: (() => void) | undefined

	const get_modal_instance = use(maoka_sdk.jabs.zags.cheat$(modal$, "instance"))

	use(maoka_sdk.jabs.classes.set("modal"))
	use(maoka_sdk.jabs.listen("onclick", event => event.stopPropagation()))

	return () => {
		const modal_instance = get_modal_instance()

		if (onunmount) {
			onunmount()
			onunmount = undefined
		}

		if (modal_instance) {
			if (modal_instance.onunmount) onunmount = modal_instance.onunmount
			if (modal_instance.size != null) use(maoka_sdk.jabs.classes.add(internal.modal_size_to_class(modal_instance.size)))

			return content_wrapper()
		} else {
			use(maoka_dom.jabs.if_dom(n => (n.value.innerHTML = "")))
		}
	}
})

const content_wrapper = maoka.create("div", ({ use }) => {
	const modal_instance = modal$.select("instance")
	use(maoka_dom.jabs.if_dom(n => void modal_instance!.render(n.value as HTMLDivElement)))
})

namespace internal {
	export const modal_size_to_class = (size: MODAL.SIZE) =>
		sweech
			.match(size)
			.case(MODAL.SIZE.SM, () => "sm")
			.case(MODAL.SIZE.MD, () => "md")
			.case(MODAL.SIZE.LG, () => "lg")
			.case(MODAL.SIZE.XL, () => "xl")
			.default(() => "2xl")
}
