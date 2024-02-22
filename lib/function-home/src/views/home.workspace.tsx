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

import { useEffect, useState } from "react"

import { useCommands, useHosts, useStrictSubscription } from "@ordo-pink/frontend-react-hooks"
import { Oath } from "@ordo-pink/oath"
import { activities$ } from "@ordo-pink/frontend-stream-activities"
import { noop } from "@ordo-pink/tau"
import { useFetch } from "@ordo-pink/frontend-fetch"

import Card from "@ordo-pink/frontend-react-components/card"
import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"

import { News } from "../function-home.types"

import NewsSection from "../components/news.component"
import Widgets from "../components/widgets.component"

export default function FileExplorerSidebar() {
	const activities = useStrictSubscription(activities$, [])
	const fetch = useFetch()
	const hosts = useHosts()
	const commands = useCommands()

	const [news, setNews] = useState<News[] | null>(null)

	useEffect(() => {
		commands.emit<cmd.application.setTitle>("application.set-title", "Главная")

		const updates0 = Oath.try(() => fetch(`${hosts.staticHost}/news.json`)).chain(res =>
			Oath.try(() => res.json() as Promise<News[]>),
		)

		void updates0.fork(noop, news => setNews(news))

		return () => {
			updates0.cancel()
		}
	}, [fetch, hosts.staticHost, commands])

	return (
		<CenteredPage centerX centerY>
			<div className="container grid grid-cols-1 gap-4 overflow-x-hidden px-2 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
				<Card title="Новости">
					<NewsSection news={news} />
				</Card>

				{activities
					.filter(activity => !!activity.widgets)
					.map(activity => (
						<Widgets key={activity.name} activityName={activity.name} widgets={activity.widgets} />
					))}
			</div>
		</CenteredPage>
	)
}
