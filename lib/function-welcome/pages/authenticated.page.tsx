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

import { is_object, is_string } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/managers"
import { use$ } from "@ordo-pink/frontend-react-hooks"

import Card from "@ordo-pink/frontend-react-components/card"
import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"

import News, { type TNews } from "../components/news.component"

export default function AuthenticatedPage() {
	const commands = use$.commands()
	const is_dev = use$.is_dev()
	const hosts = use$.hosts()
	const logger = use$.logger()
	const current_language = use$.current_language()
	const fetch = use$.fetch()
	const translate = use$.translation()

	const t_title = translate("t.welcome.authenticated_page_title")
	const t_news = translate("t.welcome.news_widget_title")

	const [news, set_news] = useState<TNews[] | null>(null)

	useEffect(() => {
		// TODO: Take file from public ordo files
		commands.emit("cmd.application.background_task.start_loading")

		const ordo_news0 = Oath.FromPromise(() =>
			fetch(`${hosts.static}/news.${current_language}.json`),
		)
			.pipe(Oath.ops.chain(check_response_status_0))
			.pipe(Oath.ops.chain(response_to_json_0))
			.pipe(Oath.ops.chain(are_new_items_0))

		// TODO: Log error on reject
		void ordo_news0.fork(
			error => {
				commands.emit("cmd.application.background_task.reset_status")
				is_dev && logger.alert(error)
			},
			news => {
				commands.emit("cmd.application.background_task.reset_status")
				set_news(news)
			},
		)

		return () => {
			commands.emit("cmd.application.background_task.reset_status")

			return ordo_news0.cancel()
		}
	}, [fetch, hosts, commands, current_language, logger, is_dev])

	useEffect(() => {
		commands.emit("cmd.application.set_title", { window_title: t_title })
	}, [commands, t_title])

	return (
		<CenteredPage centerX centerY>
			<div className="container grid grid-cols-1 gap-4 overflow-x-hidden px-2 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
				<Card title={t_news}>
					<News news={news} />
				</Card>

				<Card title="TODO!">
					<ul className="list-decimal">
						<li>Update metadata/content backend</li>
						<li>Share public files (+ add links)</li>
						<li>Bring back achievements</li>
						<li>Bring back editor</li>
						<li>Bring back user page</li>
						<li>Handle confirm email</li>
						<li>Cache in indexeddb</li>
						<li>Remove redundant stuff</li>
					</ul>

					<ul className="list-decimal">
						<li>User info in status bar</li>
						<li>Widgets on welcome page</li>
						<li>Editor unauthenticated demo</li>
						<li>User settings support (theme, language)</li>
						<li>Media files support</li>
						<li>User avatar</li>
					</ul>
				</Card>

				{/* {activities
					.filter(activity => !!activity.widgets)
					.map(activity => (
						<Widgets key={activity.name} activityName={activity.name} widgets={activity.widgets} />
					))} */}
			</div>
		</CenteredPage>
	)
}

// --- Internal ---

const ERROR_LOCATION = "AuthenticatedPage"

const einval = RRR.codes.einval(ERROR_LOCATION)

const is_new_item = (item: unknown): item is TNews =>
	is_object(item) &&
	["title", "message", "title"].reduce((acc, key) => acc && is_string(item[key]), true)

const are_new_items = (items: unknown[]): items is TNews[] =>
	!!items.reduce((acc, item) => acc && is_new_item(item), true)

const check_response_status_0 = (res: Response) =>
	Oath.If(res.status === 200)
		.pipe(Oath.ops.map(() => res))
		.pipe(Oath.ops.rejected_map(() => einval(`check_response_status -> status: ${res.status}`)))

const response_to_json_0 = (res: Response) =>
	Oath.Try(
		() => res.json(),
		() => einval("response_to_json -> failed parsing JSON"),
	)

const are_new_items_0 = (news: unknown) =>
	Oath.If(Array.isArray(news) && are_new_items(news))
		.pipe(Oath.ops.map(() => news as TNews[]))
		.pipe(Oath.ops.rejected_map(() => einval("are_new_items -> items are not TNews")))
