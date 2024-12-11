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
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaZAGS } from "@ordo-pink/maoka-zags"

const zags = MaokaZAGS.Of({ counter: { value: 0 } })

export const App = Maoka.create("div", ({ use }) => {
	use(MaokaJabs.set_class("min-h-svh"))

	return () => [Counter, Button]
})

const Counter = Maoka.create("div", ({ use }) => {
	const get_counter = use(zags.select$(state => state.counter.value))

	return () => String(get_counter())
})

const Button = Maoka.create("button", ({ element, use }) => {
	const get_counter = use(zags.select$(state => state.counter.value))

	element.onclick = () => zags.update("counter", { value: get_counter() + 1 })

	return () => "Click Me!"
})
