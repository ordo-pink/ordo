// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

"use client"

import { useLayoutEffect } from "react"
import { Button } from "./button"
import BetaInvitation from "./beta-invitation.component"

type P = { webHost: string; staticHost: string }
export default function IndexHeroSection({ webHost, staticHost }: P) {
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
			<div className="hero-layers h-screen will-change-transform transition-transform">
				<div
					className="hero-layer-1 absolute inset-[-40vw] bg-cover bg-center flex items-center justify-center scale-125 pointer-events-none"
					style={{
						backgroundImage: `url(${staticHost}/index-hero-layer-0.png)`,
					}}
				/>
				<div
					className="hero-layer-2 absolute inset-0 bg-cover bg-center flex items-center justify-center opacity-20 pointer-events-none"
					style={{
						backgroundImage: `url(${staticHost}/index-hero-layer-1.png)`,
					}}
				/>
				<div
					className="hero-layer-3 absolute inset-0 bg-cover bg-center flex items-center justify-center opacity-30 pointer-events-none"
					style={{
						backgroundImage: `url(${staticHost}/index-hero-layer-2.png)`,
					}}
				/>
			</div>

			<div className="fixed top-0 w-screen h-screen flex items-center justify-center p-4 sm:p-12">
				<div className="flex w-full justify-between max-w-5xl">
					<div className="flex flex-col lg:flex-row space-y-12 py-12 lg:space-y-0 lg:space-x-24 justify-between items-center w-full p-4 lg:px-24 lg:py-20 max-w-5xl backdrop-blur-md bg-gradient-to-br from-sky-950/20 via-indigo-950/20 to-indigo-950/20 shadow-xl rounded-xl">
						<div className="inset-0 bg-cover bg-center flex flex-col items-center justify-center">
							<h1 className="text-center text-xl sm:text-2xl uppercase tracking-tight">
								Bring your thoughts to
								<span className="block text-7xl sm:text-8xl tracking-widest sm:tracking-normal font-black first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent">
									ORDO
								</span>
							</h1>
							<div className="mt-12 flex space-x-8 items-center">
								<Button onClick={handleLearnMoreClick}>Подробнее</Button>
								{/* <Link href="#about">Подробнее</Link> */}
							</div>
						</div>

						<div className="max-w-sm">
							<BetaInvitation webHost={webHost} />
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
