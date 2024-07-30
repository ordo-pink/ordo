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

import Head from "next/head"
import { PropsWithChildren } from "react"

import DataLabel from "@ordo-pink/frontend-react-components/data-label"

import { Centered } from "../components/centered"
import Footer from "../components/footer.component"
import { PostMeta } from "../types"

type P = PropsWithChildren<{ post: PostMeta }>
export const BlogPostLayout = ({ children, post }: P) => {
	// const credits = post.hero.substring(1, post.hero.lastIndexOf("."))
	const Labels = () => post.labels.map(label => <DataLabel key={label}>{label}</DataLabel>)

	return (
		<main className="flex h-full min-h-screen flex-col">
			<Head>
				<title>{post.title} | Ordo.pink Blog</title>
				<meta name="description" content={post.description} />
				<meta property="og:type" content="article" />
				<meta property="og:title" content={post.title} />
				<meta property="og:description" content={post.description} />
				<meta property="og:url" content={`https://ordo.pink/blog/${post.slug}.html`} />
				<meta property="og:image" content={`https://ordo.pink/blog/${post.slug}.og.png`} />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<meta name="twitter:title" content={post.title} />
				<meta name="twitter:description" content={post.description} />
				<meta name="twitter:image" content={`https://ordo.pink/blog/${post.slug}.og.png`} />
			</Head>
			<article className="h-full grow overflow-x-hidden">
				<div className="relative">
					<div className="absolute inset-x-3 top-3 flex items-center justify-between">
						<div className="flex flex-wrap gap-2">
							<Labels />
						</div>

						<div>
							<a href="/">
								<svg
									viewBox="0 0 24 24"
									className="size-8 mix-blend-difference invert"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M21.4498 10.275L11.9998 3.1875L2.5498 10.275L2.9998 11.625H3.7498V20.25H20.2498V11.625H20.9998L21.4498 10.275ZM5.2498 18.75V10.125L11.9998 5.0625L18.7498 10.125V18.75H14.9999V14.3333L14.2499 13.5833H9.74988L8.99988 14.3333V18.75H5.2498ZM10.4999 18.75H13.4999V15.0833H10.4999V18.75Z"
									/>
								</svg>
							</a>
						</div>
					</div>
				</div>
				<div className="flex justify-center px-4 py-8">
					<div className="flex w-full max-w-2xl flex-col space-y-4">
						<h1 className="text-4xl font-black">
							<span className="my-4 block w-full text-center">
								<span>{post.title}</span>
								<span className="align-super text-base font-normal text-neutral-500">
									{" "}
									{post.date.toISOString().split("T")[0]}
								</span>
							</span>
						</h1>
						{children}
					</div>
				</div>
			</article>
			<Centered centerX>
				<div className="w-full px-8 pt-32 backdrop-saturate-50">
					<div className="mt-24 pb-4">
						<Footer />
					</div>
				</div>
			</Centered>
		</main>
	)
}
