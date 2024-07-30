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

import { useEffect } from "react"

import { use$ } from "@ordo-pink/frontend-react-hooks"

import CorePrinciples from "../sections/core-principles.section"
import IndexHeroSection from "../sections/hero.section"
import RequestAccess from "../sections/request-access.section"

export default function UnauthenticatedPage() {
	const commands = use$.commands()

	const translate = use$.scoped_translation("pink.ordo.welcome")

	const t_title = translate("title")
	const t_cookies_warning = translate("cookies_warning")

	useEffect(() => {
		commands.emit<cmd.application.set_title>("application.set_title", {
			window_title: t_title,
			status_bar_title: t_cookies_warning,
		})
	}, [commands, t_title, t_cookies_warning])

	return (
		<div className="overflow-y-visible">
			<IndexHeroSection />
			<CorePrinciples />
			<RequestAccess />
		</div>
	)
}
