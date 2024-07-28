import { useEffect, useState } from "react"

import { is_object, is_string } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/data"
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
	const translate = use$.scoped_translation("pink.ordo.welcome")

	const t_title = translate("auth_title")
	const t_news = translate("news_widget_title")

	const [news, set_news] = useState<TNews[] | null>(null)

	useEffect(() => {
		// TODO: Take file from public ordo files
		commands.emit<cmd.application.background_task.start_loading>(
			"application.background_task.start_loading",
		)

		const ordo_news0 = Oath.FromPromise(() =>
			fetch(`${hosts.static}/news.${current_language}.json`),
		)
			.pipe(Oath.ops.chain(check_response_status_0))
			.pipe(Oath.ops.chain(response_to_json_0))
			.pipe(Oath.ops.chain(are_new_items_0))

		// TODO: Log error on reject
		void ordo_news0.fork(
			error => {
				commands.emit<cmd.application.background_task.reset_status>(
					"application.background_task.reset_status",
				)

				void is_dev && logger.alert(error)
			},
			news => {
				commands.emit<cmd.application.background_task.reset_status>(
					"application.background_task.reset_status",
				)

				set_news(news)
			},
		)

		return () => {
			commands.emit<cmd.application.background_task.reset_status>(
				"application.background_task.reset_status",
			)

			ordo_news0.cancel()
		}
	}, [fetch, hosts, commands, current_language, logger, is_dev])

	useEffect(() => {
		commands.emit<cmd.application.set_title>("application.set_title", {
			window_title: t_title,
		})
	}, [commands, t_title])

	return (
		<CenteredPage centerX centerY>
			<div className="container grid grid-cols-1 gap-4 overflow-x-hidden px-2 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
				<Card title={t_news}>
					<News news={news} />
				</Card>

				<Card title="TODO!">
					<ul className="list-decimal">
						<li>Move sign out to auth</li>
						<li>Handle confirm email</li>
						<li>User info in status bar</li>
						<li>Update metadata/content backend</li>
						<li>Share public files (+ add links)</li>
						<li>Bring back modal / ctx menu / command palette</li>
						<li>Bring back achievements</li>
						<li>Bring back editor</li>
						<li>Bring back user page</li>
						<li>Cache in indexeddb</li>
						<li>Remove redundant stuff</li>
					</ul>

					<ul className="list-decimal">
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