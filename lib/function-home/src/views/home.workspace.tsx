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

import { Oath, chain_oath, from_boolean_oath, from_promise_oath } from "@ordo-pink/oath"
import { is_object, is_string, noop } from "@ordo-pink/tau"
import { useCommands, useHostsUnsafe, useStrictSubscription } from "@ordo-pink/frontend-react-hooks"
import { activities$ } from "@ordo-pink/frontend-stream-activities"
import { useFetch } from "@ordo-pink/frontend-fetch"

import Card from "@ordo-pink/frontend-react-components/card"
import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"

import { News } from "../function-home.types"

import NewsSection from "../components/news.component"
import Widgets from "../components/widgets.component"

export default function FileExplorerSidebar() {
	const activities = useStrictSubscription(activities$, [])
	const fetch = useFetch()
	const hosts = useHostsUnsafe()
	const commands = useCommands()

	const [news, setNews] = useState<News[] | null>(null)

	useEffect(() => {
		commands.emit<cmd.application.set_title>("application.set-title", "Главная")

		const ordoNews0 = from_promise_oath(() => fetch(`${hosts.static_host}/news.json`))
			.pipe(chain_oath(responseToJson0))
			.pipe(chain_oath(checkIsArray0))
			.pipe(chain_oath(checkItemsAreNewsItems))

		// TODO: Log error on reject
		void ordoNews0.fork(noop, news => setNews(news))

		return () => void ordoNews0.cancel()
	}, [fetch, hosts.static_host, commands])

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

// --- Internal ---

const isNewsItem = (item: unknown): item is News =>
	is_object(item) &&
	["title", "message", "title"].reduce((acc, key) => acc && is_string(item[key]), true)

const areNewsItems = (items: unknown[]): items is News[] =>
	!!items.reduce((acc, item) => acc && isNewsItem(item), true)

type TResponseToJsonFn = (r: Response) => Oath<unknown, Error>
const responseToJson0: TResponseToJsonFn = res => from_promise_oath(() => res.json())

type TCheckIsArrayFn = (r: unknown) => Oath<unknown[], Error>
const checkIsArray0: TCheckIsArrayFn = news =>
	from_boolean_oath(Array.isArray(news), news as unknown[])

type TCheckItemsAreNewsItemsFn = (r: unknown[]) => Oath<News[], Error>
const checkItemsAreNewsItems: TCheckItemsAreNewsItemsFn = news =>
	from_boolean_oath(areNewsItems(news), news as News[])
