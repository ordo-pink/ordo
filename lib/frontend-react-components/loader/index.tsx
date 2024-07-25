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

import { useLayoutEffect, useRef } from "react"

import { Switch } from "@ordo-pink/switch"
import { useIsDarkTheme } from "@ordo-pink/frontend-react-hooks"

import "./loader.css"

type P = { size?: "s" | "m" | "l" }
export default function Loader({ size }: P) {
	const ref = useRef<HTMLDivElement>(null)
	const is_dark_theme = useIsDarkTheme()
	const class_name = Switch.Match(size)
		.case("s", () => "loader small")
		.case("l", () => "loader large")
		.default(() => "loader")

	useLayoutEffect(() => {
		if (!ref.current) return

		ref.current.style.setProperty("--background", is_dark_theme ? "black" : "white")
	}, [ref, is_dark_theme])

	return (
		<div ref={ref} className={class_name}>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	)
}
