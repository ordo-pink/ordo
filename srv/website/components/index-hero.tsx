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

"use client"

import { useLayoutEffect } from "react"

import { Button } from "./button"

import BetaInvitation from "./beta-invitation.component"

type P = { staticHost: string }
export default function IndexHeroSection({ staticHost }: P) {
	useLayoutEffect(() => {
		const listener = (event: MouseEvent) => {
			Object.assign(document.documentElement, {
				style: `
        --move-x: ${(event.clientX - window.innerWidth / 2) * -0.005}deg;
        --move-y: ${(event.clientY - window.innerHeight / 2) * -0.01}deg;
				--layer-0: ;
				--layer-1: ${staticHost}/index-hero-layer-1.png;
				--layer-2: ${staticHost}/index-hero-layer-2.png;
        `,
			})
		}

		document.addEventListener("mousemove", listener)

		return () => document.removeEventListener("mousemove", listener)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleLearnMoreClick = () =>
		window.scrollTo({ behavior: "smooth", top: window.innerHeight })

	return (
		<section className="hero-section overflow-hidden">
			<div className="hero-layers h-screen transition-transform will-change-transform">
				<div
					className="hero-layer-1 pointer-events-none absolute inset-[-40vw] flex scale-125 items-center justify-center bg-cover bg-center"
					style={{
						backgroundImage: `url(${staticHost}/index-hero-layer-0.png)`,
					}}
				/>
				<div
					className="hero-layer-2 pointer-events-none absolute inset-0 flex items-center justify-center bg-cover bg-center opacity-20"
					style={{
						backgroundImage: `url(${staticHost}/index-hero-layer-1.png)`,
					}}
				/>
				<div
					className="hero-layer-3 pointer-events-none absolute inset-0 flex items-center justify-center bg-cover bg-center opacity-30"
					style={{
						backgroundImage: `url(${staticHost}/index-hero-layer-2.png)`,
					}}
				/>
			</div>

			<div className="fixed top-0 flex h-screen w-screen items-center justify-center p-4 sm:p-12">
				<div className="flex w-full max-w-5xl justify-between">
					<div className="flex w-full max-w-5xl flex-col items-center justify-between space-y-12 rounded-xl bg-gradient-to-br from-sky-950/20 via-indigo-950/20 to-indigo-950/20 p-4 py-12 shadow-xl backdrop-blur-md lg:flex-row lg:space-x-24 lg:space-y-0 lg:px-24 lg:py-20">
						<div className="inset-0 flex flex-col items-center justify-center bg-cover bg-center">
							<h1 className="text-center text-xl uppercase tracking-tight sm:text-2xl">
								Bring your thoughts to
								<span className="block text-7xl font-black tracking-widest first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent sm:text-8xl sm:tracking-normal">
									ORDO
								</span>
							</h1>
							<div className="mt-12 flex items-center space-x-8">
								<Button onClick={handleLearnMoreClick}>Подробнее</Button>
								{/* <Link href="#about">Подробнее</Link> */}
							</div>
						</div>

						<div className="w-full max-w-md">
							<BetaInvitation />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
