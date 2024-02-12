import { BsArrowUpRight } from "react-icons/bs"

import { Either } from "@ordo-pink/either"

import Link from "@ordo-pink/frontend-react-components/link"
import Loader from "@ordo-pink/frontend-react-components/loader"

import { type News } from "../function-home.types"

type P = { news: News[] | null }
export default function NewsSection({ news }: P) {
	return Either.fromNullable(news).fold(
		() => (
			<div className="flex size-full items-center justify-center">
				<Loader size="l" />
			</div>
		),
		news => (
			<>
				{news.map(article => (
					<div key={article.title} className="flex flex-col space-y-2">
						<div className="mb-1 flex flex-wrap items-center justify-between space-x-2">
							<h4 className="text-xl font-bold">{article.title}</h4>
							<dt className="text-xs text-neutral-500">
								{new Date(article.date).toLocaleDateString()}
							</dt>
						</div>
						<p>{article.message}</p>
						{article.link ? (
							<Link href={article.link} external newTab>
								<span className="flex items-center space-x-2">
									<span>Подробнее</span>
									<BsArrowUpRight />
								</span>
							</Link>
						) : null}
					</div>
				))}
			</>
		),
	)
}
