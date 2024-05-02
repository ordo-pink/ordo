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

import { BsArrowUpRight } from "react-icons/bs"

import { fromNullableE } from "@ordo-pink/either"

import Link from "@ordo-pink/frontend-react-components/link"
import Loader from "@ordo-pink/frontend-react-components/loader"

import { type News } from "../function-home.types"

type P = { news: News[] | null }
export default function NewsSection({ news }: P) {
	return fromNullableE(news).fold(
		() => (
			<div className="flex size-full items-center justify-center">
				<Loader size="l" />
			</div>
		),
		news => (
			<>
				{news.slice(0, 2).map(article => (
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
