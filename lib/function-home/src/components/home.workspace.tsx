import { useEffect, useState } from "react"

import { useHosts, useStrictSubscription } from "@ordo-pink/frontend-react-hooks"
import { Oath } from "@ordo-pink/oath"
import { activities$ } from "@ordo-pink/frontend-stream-activities"
import { noop } from "@ordo-pink/tau"
import { useFetch } from "@ordo-pink/frontend-fetch"

import Card from "@ordo-pink/frontend-react-components/card"
import CenteredPage from "@ordo-pink/frontend-react-components/centered-page"

import { News } from "../function-home.types"

import NewsSection from "./news.component"
import Widgets from "./widgets.component"

export default function FileExplorerSidebar() {
	const activities = useStrictSubscription(activities$, [])
	const fetch = useFetch()
	const hosts = useHosts()

	const [news, setNews] = useState<News[] | null>(null)

	useEffect(() => {
		const updates0 = Oath.try(() => fetch(`${hosts.staticHost}/updates.json`)).chain(res =>
			Oath.try(() => res.json() as Promise<News[]>),
		)

		void updates0.fork(noop, news => setNews(news))

		return () => {
			updates0.cancel()
		}
	}, [fetch, hosts.staticHost])

	return (
		<CenteredPage centerX centerY>
			<div className="container grid grid-cols-1 gap-4 overflow-x-hidden px-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
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
